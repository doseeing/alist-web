const data = {
  code: 200,
  message: "success",
  data: {
    allow_indexed: "false",
    allow_mounted: "true",
    announcement: "### repo\nhttps://github.com/alist-org/alist",
    audio_autoplay: "true",
    audio_cover: "https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg",
    auto_update_index: "false",
    default_page_size: "30",
    external_previews: "{}",
    favicon: "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg",
    filename_char_mapping: '{"/": "|"}',
    forward_direct_link_params: "false",
    hide_files: "/\\/README.md/i",
    home_container: "max_980px",
    home_icon: "🏠",
    iframe_previews:
      '{\n\t"doc,docx,xls,xlsx,ppt,pptx": {\n\t\t"Microsoft":"https://view.officeapps.live.com/op/view.aspx?src=$e_url",\n\t\t"Google":"https://docs.google.com/gview?url=$e_url\u0026embedded=true"\n\t},\n\t"pdf": {\n\t\t"PDF.js":"https://alist-org.github.io/pdf.js/web/viewer.html?file=$e_url"\n\t},\n\t"epub": {\n\t\t"EPUB.js":"https://alist-org.github.io/static/epub.js/viewer.html?url=$e_url"\n\t}\n}',
    ignore_direct_link_params: "sign,alist_ts",
    ldap_login_enabled: "false",
    ldap_login_tips: "login with ldap",
    logo: "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg",
    main_color: "#1890ff",
    ocr_api: "https://api.nn.ci/ocr/file/json",
    package_download: "true",
    pagination_type: "all",
    robots_txt: "User-agent: *\nAllow: /",
    search_index: "none",
    settings_layout: "list",
    site_title: "AList",
    sso_compatibility_mode: "false",
    sso_login_enabled: "false",
    sso_login_platform: "",
    version: "v3.39.4",
    video_autoplay: "true",
    webauthn_login_enabled: "false",
  },
}
export function GET(request: Request) {
  return new Response(JSON.stringify(data))
}