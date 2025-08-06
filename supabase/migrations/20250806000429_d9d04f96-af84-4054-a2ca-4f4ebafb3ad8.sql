-- Add missing triggers for updated_at columns on new tables
CREATE OR REPLACE TRIGGER update_education_analytics_updated_at 
  BEFORE UPDATE ON public.education_analytics 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_skill_assessments_updated_at 
  BEFORE UPDATE ON public.skill_assessments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_certifications_updated_at 
  BEFORE UPDATE ON public.certifications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_performance_reviews_updated_at 
  BEFORE UPDATE ON public.performance_reviews 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_scheduled_reports_config_updated_at 
  BEFORE UPDATE ON public.scheduled_reports_config 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_mentorship_sessions_updated_at 
  BEFORE UPDATE ON public.mentorship_sessions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_product_certifications_updated_at 
  BEFORE UPDATE ON public.product_certifications 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();