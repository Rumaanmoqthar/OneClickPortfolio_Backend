// This function generates the HTML for the "Modern" downloadable portfolio.

export const getModernPortfolioHTML = (resume) => {
  const getBackgroundImage = (jobRole = '') => {
    const role = jobRole.toLowerCase();
    if (role.includes('backend') || role.includes('server')) return 'https://images.unsplash.com/photo-1592609931095-54a2168ae293?q=80&w=2940&auto=format&fit=crop';
    if (role.includes('frontend') || role.includes('ui') || role.includes('design')) return 'https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2835&auto=format&fit=crop';
    if (role.includes('full-stack')) return 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=2940&auto=format&fit=crop';
  };
  const backgroundImageUrl = getBackgroundImage(resume.currentJobRole);

  const generateExperience = (experience) => experience?.map(exp => `
    <div class="relative"><div class="absolute -left-[30px] top-1 h-4 w-4 bg-cyan-400 rounded-full border-4 border-black/60"></div><p class="text-base text-white/70">${exp.fromDate} - ${exp.toDate}</p><h3 class="text-xl font-semibold text-white mt-1">${exp.role || ''}</h3><p class="text-cyan-300">${exp.companyName || ''}</p><p class="text-base text-white/80 mt-2 leading-relaxed">${exp.description || ''}</p></div>`).join('') || '';
  const generateProjects = (projects) => projects?.map(proj => `<div class="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"><h3 class="text-md font-semibold text-white">${proj.project_name || ''}</h3><p class="mt-2 text-sm text-white/70">${proj.project_description || ''}</p></div>`).join('') || '';
  const generateEducation = (education) => education?.map(edu => `<div class="relative"><div class="absolute -left-[30px] top-1 h-4 w-4 bg-cyan-400 rounded-full border-4 border-black/60"></div><p class="text-base text-white/70">${edu.fromDate || ''} - ${edu.toDate || ''}</p><h3 class="text-xl font-semibold text-white mt-1">${edu.institution || ''}</h3><p class="text-cyan-300 text-base">${edu.degree || ''}</p>${edu.description ? `<p class='text-base text-white/80 mt-2 leading-relaxed'>${edu.description}</p>` : ''}</div>`).join('') || '';
  const generateSkills = (skills) => skills?.map(skill => `<span class="bg-white/10 text-cyan-200 text-sm font-medium px-4 py-1.5 rounded-full">${skill}</span>`).join('') || '';

  return `<!DOCTYPE html>
    <html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Portfolio | ${resume.name.full}</title><script src="https://cdn.tailwindcss.com"></script><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');body{font-family:'Inter',sans-serif;}</style></head>
    <body class="min-h-screen bg-cover bg-center bg-fixed p-0" style="background-image: url('${backgroundImageUrl}')">
      <div class="min-h-screen bg-black/70">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-0 text-white">
          <aside class="lg:col-span-1 p-8 lg:py-16 border-b lg:border-b-0 lg:border-r border-white/10">
            <div class="relative flex flex-col items-center lg:items-start gap-6">
              <div class="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-center text-xs text-white/50 overflow-hidden">Profile<br/>Picture<span class="absolute -inset-1 rounded-full bg-cyan-400/20 blur-md -z-10"></span></div>
              <div class="text-center lg:text-left">
                <h1 class="text-3xl sm:text-4xl font-bold">${resume.name.full}</h1>
                <p class="text-cyan-300 mt-1">${resume.currentJobRole}</p>
              </div>
              <div class="space-y-2 text-white/80 text-sm">
                <div><a href="mailto:${resume.email}" class="hover:text-cyan-300">${resume.email}</a></div>
                <div>${resume.phone}</div>
                <div>${resume.address?.city || 'Global'}</div>
              </div>
            </div>
          </aside>
          <div class="lg:col-span-2 p-8 lg:py-16 space-y-12">
            <section><h2 class="text-2xl font-bold tracking-tight text-white mb-6">About</h2><p class="text-white/90 leading-relaxed text-lg">${resume.jobDescription}</p></section>
            <section><h2 class="text-2xl font-bold tracking-tight text-white mb-6">Skills</h2><div class="flex flex-wrap gap-3">${generateSkills(resume.skills)}</div></section>
            <section><h2 class="text-2xl font-bold tracking-tight text-white mb-6">Experience</h2><div class="relative space-y-8 pl-6 border-l-2 border-white/10">${generateExperience(resume.experience)}</div></section>
            <section><h2 class="text-2xl font-bold tracking-tight text-white mb-6">Education</h2><div class="relative space-y-8 pl-6 border-l-2 border-white/10">${generateEducation(resume.education)}</div></section>
            <section><h2 class="text-2xl font-bold tracking-tight text-white mb-6">Interests</h2><p class="text-white/90 leading-relaxed text-lg">${resume.hobbies || resume.currentJobRole}</p></section>
            <footer class="pt-6 border-t border-white/10 text-white/60 text-sm"><p>${resume.hobbies || 'Passion for technology and continuous learning.'}</p></footer>
          </div>
        </div>
      </div>
    </body></html>`;
};
