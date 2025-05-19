import { Card, CardContent } from "@/components/ui/MovieCard";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex gap-2 justify-center">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">{t('notFound.title')}</h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
