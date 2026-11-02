export interface AdminPageTemplate {
  seoTitle: string;
  seoDescription: string;
  title: string;
}

export interface DashboardPageTemplate extends AdminPageTemplate {
  intro: string;
}
