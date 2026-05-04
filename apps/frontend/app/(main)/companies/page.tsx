"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "@/services/jobService";
import { useAuthStore } from "@/store/authStore";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { Company } from "@/types";
import { Building2, MapPin, Globe, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

export default function CompaniesPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAllCompanies(),
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Companies</h1>
        {user?.role === "RECRUITER" && (
          <Button onClick={() => router.push("/companies/create")}>
            <Plus size={14} />
            Add Company
          </Button>
        )}
      </div>

      {(!companies || companies.length === 0) ? (
        <Card className="text-center py-16">
          <Building2 size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <p className="text-text-muted">No companies found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company: Company) => (
            <Card
              key={company.id}
              hover
              padding="md"
              className="cursor-pointer"
              onClick={() => router.push(ROUTES.COMPANY_DETAIL(company.id))}
            >
              {/* Logo */}
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated flex items-center justify-center mb-4">
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <Building2 size={24} className="text-text-muted" />
                )}
              </div>

              <h3 className="font-semibold text-text-primary mb-1">{company.name}</h3>

              {company.industry && (
                <Badge variant="violet" className="mb-2">{company.industry}</Badge>
              )}

              <div className="space-y-1 mt-2">
                {company.location && (
                  <p className="text-xs text-text-muted flex items-center gap-1.5">
                    <MapPin size={11} />
                    {company.location}
                  </p>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-cyan hover:text-cyan-light flex items-center gap-1.5 transition-colors"
                  >
                    <Globe size={11} />
                    {company.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>

              {company.description && (
                <p className="text-xs text-text-muted mt-3 line-clamp-2">
                  {company.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
