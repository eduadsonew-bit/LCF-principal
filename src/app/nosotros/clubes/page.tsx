"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Search,
  MapPin,
  Mail,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Tipo que viene de la API /api/public/teams
interface Team {
  id: string;
  name: string;
  logo: string | null;
  city: string | null;
  contact: string | null;
}

export default function ClubesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/public/teams");
        if (res.ok) {
          const data = await res.json();
          setTeams(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Filtrar clubes
  const filteredClubs = teams.filter((team) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      team.name.toLowerCase().includes(term) ||
      (team.city || "").toLowerCase().includes(term) ||
      (team.contact || "").toLowerCase().includes(term);
    return matchesSearch;
  });

  // Stats dinámicas
  const totalClubs = teams.length;
  const uniqueCities = new Set(teams.map((t) => t.city).filter(Boolean)).size;
  const withContact = teams.filter((t) => t.contact).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Clubes</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Shield className="h-8 w-8 text-[#fcd34d]" />
              <h1 className="text-3xl font-bold text-[#fcd34d]">Clubes</h1>
            </div>
            <p className="text-green-100">
              Conoce los clubes afiliados a la Liga Caldense de Fútbol
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            <p className="text-gray-500 text-sm">Cargando clubes...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {totalClubs}
                  </div>
                  <div className="text-sm text-gray-600">Clubes Activos</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {uniqueCities}
                  </div>
                  <div className="text-sm text-gray-600">Municipios</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-4 text-center">
                  <Mail className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {withContact}
                  </div>
                  <div className="text-sm text-gray-600">Con Contacto</div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de búsqueda */}
            <Card className="mb-6 shadow-lg border-0">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar clubes por nombre, municipio o contacto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Grid de clubes */}
            {filteredClubs.length === 0 ? (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Shield className="h-20 w-20 text-gray-200 mx-auto mb-4" />
                  {teams.length === 0 ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Aún no hay clubes registrados
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Los clubes se agregan desde el panel de administración
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No se encontraron clubes
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Intenta con otro término de búsqueda
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClubs.map((team) => (
                  <Card
                    key={team.id}
                    className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-0 hover:-translate-y-1"
                  >
                    <CardContent className="p-0">
                      {/* Barra decorativa */}
                      <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />

                      <div className="p-4">
                        {/* Header: Logo */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-14 h-14 rounded-xl bg-green-50 border-2 border-green-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-green-300 transition-colors shadow-sm">
                            {team.logo ? (
                              <img
                                src={team.logo}
                                alt={`Escudo ${team.name}`}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Shield className="h-7 w-7 text-green-400" />
                            )}
                          </div>
                        </div>

                        {/* Nombre del club */}
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg group-hover:text-green-700 transition-colors">
                          {team.name}
                        </h3>

                        {/* Info: Ciudad y Contacto */}
                        <div className="space-y-1.5 text-sm text-gray-600">
                          {team.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <span>{team.city}</span>
                            </div>
                          )}
                          {team.contact && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <a
                                href={`mailto:${team.contact}`}
                                className="text-green-700 hover:text-green-900 hover:underline transition-colors"
                              >
                                {team.contact}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">Liga Caldense de Fútbol &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
