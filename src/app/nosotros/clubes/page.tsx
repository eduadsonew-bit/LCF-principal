"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Search,
  MapPin,
  Trophy,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Tipo que viene de la API /api/public/teams
interface Team {
  id: string;
  name: string;
  logo: string | null;
  city: string | null;
  category: string | null;
}

// Mapeo de categoría de la BD → etiqueta legible
const categoryLabels: Record<string, string> = {
  "primera-a": "Primera A",
  "primera-b": "Primera B",
  "sub-20": "Sub-20",
  "sub-17": "Sub-17",
  juvenil: "Juvenil",
  infantil: "Infantil",
  adulto: "Adulto",
};

// Colores badge por categoría
const getCategoryColor = (category: string | null) => {
  const colors: Record<string, string> = {
    "primera-a": "bg-green-100 text-green-700 border-green-200",
    "Primera A": "bg-green-100 text-green-700 border-green-200",
    "primera-b": "bg-blue-100 text-blue-700 border-blue-200",
    "Primera B": "bg-blue-100 text-blue-700 border-blue-200",
    juvenil: "bg-amber-100 text-amber-700 border-amber-200",
    Juvenil: "bg-amber-100 text-amber-700 border-amber-200",
    infantil: "bg-purple-100 text-purple-700 border-purple-200",
    Infantil: "bg-purple-100 text-purple-700 border-purple-200",
    "sub-20": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "sub-17": "bg-pink-100 text-pink-700 border-pink-200",
    adulto: "bg-green-100 text-green-700 border-green-200",
  };
  return colors[category || ""] || "bg-gray-100 text-gray-700 border-gray-200";
};

// Gradiente decorativo por categoría
const getCategoryGradient = (category: string | null) => {
  const gradients: Record<string, string> = {
    "primera-a": "from-green-500 to-emerald-600",
    "primera-b": "from-blue-500 to-indigo-600",
    juvenil: "from-amber-400 to-orange-500",
    infantil: "from-purple-400 to-pink-500",
    "sub-20": "from-cyan-400 to-teal-500",
    "sub-17": "from-pink-400 to-rose-500",
    adulto: "from-green-500 to-emerald-600",
  };
  return gradients[category || ""] || "from-green-500 to-emerald-600";
};

const formatCategory = (category: string | null) => {
  if (!category) return "Sin categoría";
  return categoryLabels[category] || category;
};

export default function ClubesPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

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

  // Categorías únicas para el filtro
  const categories = [
    "todos",
    ...Array.from(
      new Set(teams.map((t) => t.category).filter(Boolean) as string[])
    ),
  ];

  // Filtrar clubes
  const filteredClubs = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (team.city || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" || team.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats dinámicas
  const totalClubs = teams.length;
  const uniqueCities = new Set(teams.map((t) => t.city).filter(Boolean)).size;
  const uniqueCategories = new Set(
    teams.map((t) => t.category).filter(Boolean)
  ).size;

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {totalClubs}
                  </div>
                  <div className="text-sm text-gray-600">Clubes Activos</div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {uniqueCategories}
                  </div>
                  <div className="text-sm text-gray-600">Categorías</div>
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
                  <ExternalLink className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {teams.filter((t) => t.logo).length}
                  </div>
                  <div className="text-sm text-gray-600">Con Escudo</div>
                </CardContent>
              </Card>
            </div>

            {/* Barra de búsqueda y filtros */}
            <Card className="mb-6 shadow-lg border-0">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Buscar clubes por nombre o municipio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Filtro por categoría */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {category === "todos"
                          ? "Todos"
                          : formatCategory(category)}
                      </button>
                    ))}
                  </div>
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
                        Intenta con otro término de búsqueda o categoría
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
                      {/* Barra decorativa con gradiente de categoría */}
                      <div
                        className={`h-2 bg-gradient-to-r ${getCategoryGradient(
                          team.category
                        )}`}
                      />

                      <div className="p-4">
                        {/* Header: Logo + Badge */}
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
                          <Badge
                            className={`${getCategoryColor(
                              team.category
                            )} text-xs font-medium`}
                            variant="secondary"
                          >
                            {formatCategory(team.category)}
                          </Badge>
                        </div>

                        {/* Nombre del club */}
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg group-hover:text-green-700 transition-colors">
                          {team.name}
                        </h3>

                        {/* Info: Ciudad y Categoría */}
                        <div className="space-y-1.5 text-sm text-gray-600">
                          {team.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <span>{team.city}</span>
                            </div>
                          )}
                          {team.category && (
                            <div className="flex items-center gap-2">
                              <Trophy className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <span>{formatCategory(team.category)}</span>
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
