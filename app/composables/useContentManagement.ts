import type { Database } from '~/types/database.types';
import type { Problem, Solution } from '~/types';

type DbProblem = Database['public']['Tables']['problems']['Row'];
type DbSolution = Database['public']['Tables']['solutions']['Row'];
type DbProblemInsert = Database['public']['Tables']['problems']['Insert'];
type DbSolutionInsert = Database['public']['Tables']['solutions']['Insert'];

export const useContentManagement = () => {
  const supabase = useSupabaseClient<Database>();

  const transformProblem = (
    dbProblem: DbProblem & { solutions?: DbSolution[] },
  ): Problem => {
    return {
      id: String(dbProblem.problem_id),
      name: dbProblem.name,
      active: dbProblem.is_active,
      displayOrder: dbProblem.display_order,
      solutions: (dbProblem.solutions || []).map(transformSolution),
    };
  };

  const transformSolution = (dbSolution: DbSolution): Solution => {
    return {
      id: dbSolution.solution_id,
      text: dbSolution.solution,
      displayOrder: dbSolution.display_order,
    };
  };

  const fetchProblems = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select(
        `
        *,
        solutions (*)
      `,
      )
      .order('display_order', { ascending: true });

    if (error) throw error;

    return (data || []).map((dbProblem) => {
      const transformed = transformProblem(dbProblem);
      // Sort solutions by display_order
      transformed.solutions.sort((a, b) => a.displayOrder - b.displayOrder);
      return transformed;
    });
  };

  const toggleProblemActive = async (problemId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('problems')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('problem_id', parseInt(problemId));

    if (error) throw error;
  };
  const createProblem = async (problem: Omit<Problem, 'id' | 'solutions'>) => {
    const { data: existingProblems } = await supabase
      .from('problems')
      .select('problem_id')
      .order('problem_id', { ascending: false })
      .limit(1);

    const nextProblemId = existingProblems?.[0]
      ? existingProblems[0].problem_id + 1
      : 1;

    const { count } = await supabase
      .from('problems')
      .select('*', { count: 'exact', head: true });

    const insertData: DbProblemInsert = {
      problem_id: nextProblemId,
      name: problem.name,
      display_order: (count || 0) + 1,
      is_active: problem.active,
    };

    const { data, error } = await supabase
      .from('problems')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateProblem = async (problem: Problem) => {
    const { error } = await supabase
      .from('problems')
      .update({
        name: problem.name,
        display_order: problem.displayOrder,
        is_active: problem.active,
        updated_at: new Date().toISOString(),
      })
      .eq('problem_id', parseInt(problem.id));

    if (error) throw error;
  };

  const deleteProblem = async (problemId: string) => {
    const { data: problem } = await supabase
      .from('problems')
      .select('id')
      .eq('problem_id', parseInt(problemId))
      .single();

    if (!problem) throw new Error('Problem not found');

    const { error } = await supabase.rpc('delete_problem_with_solutions', {
      problem_uuid: problem.id,
    });

    if (error) throw error;
  };

  const addSolution = async (
    problemId: string,
    solution: Omit<Solution, 'id' | 'displayOrder'>,
  ) => {
    const { data: problem } = await supabase
      .from('problems')
      .select('id')
      .eq('problem_id', parseInt(problemId))
      .single();

    if (!problem) throw new Error('Problem not found');

    const { data: existingSolutions } = await supabase
      .from('solutions')
      .select('solution_id')
      .eq('problem_id', problem.id)
      .order('display_order', { ascending: false })
      .limit(1);

    let nextSolutionId: string;
    if (existingSolutions?.[0]) {
      const lastLetter = existingSolutions[0].solution_id.replace(
        problemId,
        '',
      );
      const nextCharCode = lastLetter.charCodeAt(0) + 1;
      nextSolutionId = `${problemId}${String.fromCharCode(nextCharCode)}`;
    } else {
      nextSolutionId = `${problemId}A`;
    }

    const { count } = await supabase
      .from('solutions')
      .select('*', { count: 'exact', head: true })
      .eq('problem_id', problem.id);

    const insertData: DbSolutionInsert = {
      problem_id: problem.id,
      solution_id: nextSolutionId,
      solution: solution.text,
      display_order: (count || 0) + 1,
    };

    const { data, error } = await supabase
      .from('solutions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  };
  const updateSolution = async (solutionId: string, text: string) => {
    const { error } = await supabase
      .from('solutions')
      .update({
        solution: text,
        updated_at: new Date().toISOString(),
      })
      .eq('solution_id', solutionId);

    if (error) throw error;
  };

  const deleteSolution = async (solutionId: string) => {
    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('solution_id', solutionId);

    if (error) throw error;
  };

  const reorderSolutions = async (solutions: Solution[], problemId: string) => {
    const { data: problem } = await supabase
      .from('problems')
      .select('id')
      .eq('problem_id', parseInt(problemId))
      .single();

    if (!problem) throw new Error('Problem not found');

    const { data: dbSolutions } = await supabase
      .from('solutions')
      .select('id, solution_id')
      .eq('problem_id', problem.id);

    if (!dbSolutions) throw new Error('Solutions not found');

    const solutionMap = new Map(dbSolutions.map((s) => [s.solution_id, s.id]));

    const updates = solutions.map((solution) => ({
      id: solutionMap.get(solution.id),
      display_order: solution.displayOrder,
    }));

    const { error } = await supabase.rpc('reorder_solutions', {
      solution_updates: updates,
    });

    if (error) throw error;
  };

  const reorderProblems = async (reorderedProblems: Problem[]) => {
    const updates = reorderedProblems.map((problem, index) =>
      supabase
        .from('problems')
        .update({
          display_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('problem_id', parseInt(problem.id)),
    );

    const results = await Promise.all(updates);

    const errors = results.filter((r) => r.error);
    if (errors.length > 0) {
      throw new Error('Failed to reorder problems');
    }
  };

  return {
    fetchProblems,
    toggleProblemActive,
    createProblem,
    updateProblem,
    deleteProblem,
    addSolution,
    updateSolution,
    deleteSolution,
    reorderSolutions,
    reorderProblems,
  };
};
