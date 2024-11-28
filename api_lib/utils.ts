export function getParentDir(path: string): string {
  if (path === "/") {
    console.log("path / has no parent")
    return ""
  }
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  let parentPath = path.split("/").slice(0, -1).join("/")
  if (parentPath === "") {
    parentPath = "/"
  }
  return parentPath
}
