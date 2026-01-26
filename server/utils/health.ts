import { getSupabaseAdmin } from './supabase';

export type ServiceStatus = 'healthy' | 'degraded' | 'down';

export interface HealthCheckResult {
  service: string;
  status: ServiceStatus;
  responseTime?: number;
  error?: string;
}

export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('users').select('id').limit(1);

    const responseTime = Date.now() - start;

    if (error) {
      return {
        service: 'Database',
        status: 'down',
        responseTime,
        error: error.message,
      };
    }

    return {
      service: 'Database',
      status: 'healthy',
      responseTime,
    };
  } catch (error) {
    return {
      service: 'Database',
      status: 'down',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkPDFServiceHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  const pdfServiceUrl = process.env.PDF_SERVICE_URL;

  if (!pdfServiceUrl) {
    return {
      service: 'PDF Generation',
      status: 'down',
      error: 'PDF_SERVICE_URL not configured',
    };
  }

  try {
    const response = await fetch(`${pdfServiceUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    const responseTime = Date.now() - start;

    if (response.ok) {
      return {
        service: 'PDF Generation',
        status: 'healthy',
        responseTime,
      };
    }

    return {
      service: 'PDF Generation',
      status: 'degraded',
      responseTime,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      service: 'PDF Generation',
      status: 'down',
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function checkAllServices(): Promise<HealthCheckResult[]> {
  const [database, pdfService] = await Promise.all([
    checkSupabaseHealth(),
    checkPDFServiceHealth(),
  ]);

  return [
    database,
    { service: 'Authentication', status: database.status },
    pdfService,
    { service: 'Storage', status: database.status },
  ];
}
