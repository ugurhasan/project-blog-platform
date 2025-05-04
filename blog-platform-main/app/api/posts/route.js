export async function GET() {
  try {
    const response = await fetch('http://localhost:8080/api/posts');
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}