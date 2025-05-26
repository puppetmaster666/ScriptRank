// lib/upload.ts (or in your upload component)
export async function uploadScript(scriptData: {
  title: string;
  genre: string;
  synopsis: string;
  fileContent: string;
  userId: string;
}) {
  try {
    // Get AI analysis
    const analysis = await fetch('/api/analyze-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        synopsis: scriptData.synopsis
      })
    }).then(res => res.json());

    if (!analysis.score) throw new Error('AI analysis failed');

    // Create script object
    const newScript = {
      id: crypto.randomUUID(),
      title: scriptData.title,
      genre: scriptData.genre,
      synopsis: scriptData.synopsis,
      userId: scriptData.userId,
      fileName: `${scriptData.title.replace(/\s+/g, '_')}.txt`,
      content: scriptData.fileContent,
      aiScore: analysis.score,
      aiComment: analysis.comment,
      createdAt: new Date().toISOString(),
      votes: []
    };

    // Save to localStorage (or your database)
    const existingScripts = JSON.parse(localStorage.getItem('scripts') || '[]');
    localStorage.setItem('scripts', JSON.stringify([...existingScripts, newScript]));

    return newScript;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}