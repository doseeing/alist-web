const data = {
  code: 200,
  message: "success",
  data: [],
}
export function GET(request: Request) {
  return new Response(JSON.stringify(data))
}
