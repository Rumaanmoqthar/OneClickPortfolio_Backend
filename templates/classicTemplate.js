// This function generates the HTML for the "Classic" downloadable portfolio.

export const getClassicPortfolioHTML = (resume) => {
  const stats = [
    { label: 'Experience', value: `${(resume.experience?.length || 0)}+` },
    { label: 'Projects', value: `${(resume.projects?.length || 0)}+` },
    { label: 'Skills', value: `${(resume.skills?.length || 0)}+` },
  ];

  const generateExperience = (experience) => experience?.map(exp => `
    <div class="relative pl-6">
      <div class="absolute left-0 top-2 h-3 w-3 rounded-full bg-blue-500"></div>
      <div class="flex flex-wrap justify-between gap-2 items-baseline">
        <h3 class="text-xl font-semibold text-gray-900">${exp.role || ''}</h3>
        <div class="text-sm text-gray-500 font-medium">${exp.fromDate || ''} - ${exp.toDate || ''}</div>
      </div>
      <p class="text-gray-700">${exp.companyName || ''}</p>
      <p class="mt-2 text-gray-600 leading-relaxed">${exp.description || ''}</p>
    </div>
  `).join('') || '';

  const generateProjects = (projects) => projects?.map(proj => `
    <div class="group rounded-xl ring-1 ring-gray-200 hover:ring-blue-500/40 transition-colors p-6 bg-gradient-to-b from-white to-gray-50 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">${proj.project_name || ''}</h3>
      <p class="mt-2 text-gray-600">${proj.project_description || ''}</p>
    </div>
  `).join('') || '';

  const generateEducation = (education) => education?.map(edu => `
    <div class="relative group">
      <div class="absolute -left-6 top-2 h-3 w-3 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500"></div>
      <div class="flex flex-wrap justify-between gap-2 items-baseline">
        <h3 class="text-xl font-semibold text-gray-900">${edu.institution || ''}</h3>
        <div class="text-sm text-gray-500 font-medium">${edu.fromDate || ''} - ${edu.toDate || ''}</div>
      </div>
      <p class="text-gray-700">${edu.degree || ''}</p>
      ${edu.description ? `<p class=\"mt-2 text-gray-600 leading-relaxed\">${edu.description}</p>` : ''}
    </div>
  `).join('') || '';

  const generateSkills = (skills) => skills?.map(skill => `
    <span class="bg-gray-100 ring-1 ring-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">${skill}</span>
  `).join('') || '';

  const statsHTML = stats.map(s => `
    <div class="px-6 py-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
      <div class="text-3xl font-extrabold text-gray-900">${s.value}</div>
      <div class="text-xs uppercase tracking-wider text-gray-500">${s.label}</div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Portfolio | ${resume.name.full}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body class="bg-gray-50">
      <!-- HERO -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div class="absolute -top-40 -right-24 h-96 w-96 rounded-full bg-blue-200/60 blur-3xl opacity-70"></div>
        <div class="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-200/60 blur-3xl opacity-70"></div>
        <div class="relative max-w-6xl mx-auto px-6 pt-20 pb-12 sm:pt-28 sm:pb-20">
          <div class="flex flex-col items-center text-center gap-6">
            <div class="relative">
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-md ring-2 ring-white/60 flex items-center justify-center text-gray-400 text-xs overflow-hidden">Profile Pic</div>
              <span class="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-400/30 via-indigo-400/30 to-purple-400/30 blur-md -z-10"></span>
            </div>
            <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">${resume.name.full}</h1>
            <p class="text-lg sm:text-xl text-gray-600">${resume.currentJobRole}</p>
            <div class="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <span><a href="mailto:${resume.email}" class="hover:text-blue-700">${resume.email}</a></span>
              <span>${resume.phone}</span>
              <span>${resume.address?.city || 'Global'}</span>
            </div>
            <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">${statsHTML}</div>
          </div>
        </div>
      </section>

      <!-- CONTENT CARD -->
      <div class="max-w-6xl mx-auto -mt-6 sm:-mt-10 mb-10 sm:mb-20 px-6">
        <div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl ring-1 ring-gray-200/80 overflow-hidden">
          <main class="p-8 sm:p-12 space-y-12">
            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About Me</h2>
              <p class="text-gray-700 leading-relaxed">${resume.jobDescription}</p>
            </section>
            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Experience</h2>
              <div class="relative space-y-8">${generateExperience(resume.experience)}</div>
            </section>
            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Education</h2>
              <div class="relative space-y-8 pl-6">${generateEducation(resume.education)}</div>
            </section>
            <section>
              <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
              <div class="flex flex-wrap gap-3">${generateSkills(resume.skills)}</div>
            </section>
          </main>
        </div>
      </div>
    </body>
    </html>
  `;
};

