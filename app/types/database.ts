export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      organisations: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          phone2: string | null
          street: string | null
          street2: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          phone2?: string | null
          street?: string | null
          street2?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          phone2?: string | null
          street?: string | null
          street2?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      problems: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          problem_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          is_active?: boolean
          name: string
          problem_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          problem_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          adjustments_to_completions_components: string | null
          area_of_issue: string | null
          casing_tubing_modifications: string | null
          changes_to_rates: string | null
          changes_to_well_design: string | null
          created_at: string
          data_correlation: string | null
          date: string
          estimates: Json | null
          failure_point: string | null
          flow_rates: string | null
          fluid_composition: string | null
          id: string
          is_complete: boolean
          is_draft: boolean
          issue_description: string | null
          long_term_solutions: string | null
          maintenance_strategy: string | null
          medium_term_solutions: string | null
          mitigations_in_place: string | null
          name: string | null
          organisation_id: string | null
          pressure: string | null
          quantity_of_leak: string | null
          recommended_actions: Json | null
          risk_level: string | null
          root_cause_analysis: Json | null
          shifts_in_reservoir_conditions: string | null
          short_term_solutions: string | null
          steps_taken: Json | null
          temperature: string | null
          timeline: Json | null
          type_of_barrier_failure: Json | null
          type_of_leak: string | null
          updated_at: string
          user_id: string | null
          well_country: string | null
          well_elevation: string | null
          well_field_name: string | null
          well_md: string | null
          well_name: string
          well_region: string | null
          well_schematic: string | null
          well_tvd: string | null
          well_type: string | null
        }
        Insert: {
          adjustments_to_completions_components?: string | null
          area_of_issue?: string | null
          casing_tubing_modifications?: string | null
          changes_to_rates?: string | null
          changes_to_well_design?: string | null
          created_at?: string
          data_correlation?: string | null
          date?: string
          estimates?: Json | null
          failure_point?: string | null
          flow_rates?: string | null
          fluid_composition?: string | null
          id?: string
          is_complete?: boolean
          is_draft?: boolean
          issue_description?: string | null
          long_term_solutions?: string | null
          maintenance_strategy?: string | null
          medium_term_solutions?: string | null
          mitigations_in_place?: string | null
          name?: string | null
          organisation_id?: string | null
          pressure?: string | null
          quantity_of_leak?: string | null
          recommended_actions?: Json | null
          risk_level?: string | null
          root_cause_analysis?: Json | null
          shifts_in_reservoir_conditions?: string | null
          short_term_solutions?: string | null
          steps_taken?: Json | null
          temperature?: string | null
          timeline?: Json | null
          type_of_barrier_failure?: Json | null
          type_of_leak?: string | null
          updated_at?: string
          user_id?: string | null
          well_country?: string | null
          well_elevation?: string | null
          well_field_name?: string | null
          well_md?: string | null
          well_name: string
          well_region?: string | null
          well_schematic?: string | null
          well_tvd?: string | null
          well_type?: string | null
        }
        Update: {
          adjustments_to_completions_components?: string | null
          area_of_issue?: string | null
          casing_tubing_modifications?: string | null
          changes_to_rates?: string | null
          changes_to_well_design?: string | null
          created_at?: string
          data_correlation?: string | null
          date?: string
          estimates?: Json | null
          failure_point?: string | null
          flow_rates?: string | null
          fluid_composition?: string | null
          id?: string
          is_complete?: boolean
          is_draft?: boolean
          issue_description?: string | null
          long_term_solutions?: string | null
          maintenance_strategy?: string | null
          medium_term_solutions?: string | null
          mitigations_in_place?: string | null
          name?: string | null
          organisation_id?: string | null
          pressure?: string | null
          quantity_of_leak?: string | null
          recommended_actions?: Json | null
          risk_level?: string | null
          root_cause_analysis?: Json | null
          shifts_in_reservoir_conditions?: string | null
          short_term_solutions?: string | null
          steps_taken?: Json | null
          temperature?: string | null
          timeline?: Json | null
          type_of_barrier_failure?: Json | null
          type_of_leak?: string | null
          updated_at?: string
          user_id?: string | null
          well_country?: string | null
          well_elevation?: string | null
          well_field_name?: string | null
          well_md?: string | null
          well_name?: string
          well_region?: string | null
          well_schematic?: string | null
          well_tvd?: string | null
          well_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          problem_id: string
          solution: string
          solution_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          problem_id: string
          solution: string
          solution_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          problem_id?: string
          solution?: string
          solution_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solutions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          polar_customer_id: string
          polar_subscription_id: string
          reports_used: number
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          polar_customer_id: string
          polar_subscription_id: string
          reports_used?: number
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          polar_customer_id?: string
          polar_subscription_id?: string
          reports_used?: number
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          engineer_role: string | null
          id: string
          include_logo: boolean | null
          is_active: boolean | null
          is_admin: boolean | null
          logo: string | null
          name: string
          organisation_id: string | null
          registration_complete: boolean
          role: Database["public"]["Enums"]["user_role"]
          show_qualifications: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          engineer_role?: string | null
          id: string
          include_logo?: boolean | null
          is_active?: boolean | null
          is_admin?: boolean | null
          logo?: string | null
          name: string
          organisation_id?: string | null
          registration_complete?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          show_qualifications?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          engineer_role?: string | null
          id?: string
          include_logo?: boolean | null
          is_active?: boolean | null
          is_admin?: boolean | null
          logo?: string | null
          name?: string
          organisation_id?: string | null
          registration_complete?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          show_qualifications?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organisation_id_fkey1"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_problem_with_solutions: {
        Args: { problem_uuid: string }
        Returns: undefined
      }
      increment_reports_used: { Args: { user_id: string }; Returns: undefined }
      reorder_solutions: {
        Args: { solution_updates: Json }
        Returns: undefined
      }
    }
    Enums: {
      subscription_status: "active" | "canceled" | "past_due"
      subscription_tier: "basic" | "pro" | "enterprise"
      user_role: "user" | "admin" | "platform_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      subscription_status: ["active", "canceled", "past_due"],
      subscription_tier: ["basic", "pro", "enterprise"],
      user_role: ["user", "admin", "platform_admin"],
    },
  },
} as const
