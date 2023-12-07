export const renderHtmlTemplate = (isDezor: boolean) => {
  const text = isDezor ? "Loading, please wait..." : "Can not render website.";
  return `<!DOCTYPE html>
<html>
<head>
  <title>Can not render website.</title>
</head>
<script>window.mediahubmxEndpoint = ".";</script>
<body>
  <tt>
    <h1>Can not render website.</h1>
  </tt>
</body>
</html>`;
};
