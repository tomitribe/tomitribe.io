<%@page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="tribeio">
<head><title>Tomitribe.io</title>
    <script>
        // doc base
        (function () {
            var contextPath = '<%=request.getContextPath()%>';
            var result = '';
            if(document.location.href === '<%=request.getRequestURL()%>') {
                if(document.location.port) {
                    result = "//" + document.location.hostname + ":" + document.location.port + contextPath + "/";
                } else {
                    result = "//" + document.location.hostname + contextPath + "/";
                }
            } else {
                var reqUrl = '<%=request.getRequestURL()%>'
                        .replace(/^http:/, '')
                        .replace(/^https:/, '')
                        .replace(/^\/\//, '')
                        .replace(/^[^\/]*/, '')
                        .replace(new RegExp('^' + contextPath, "i"), '');
                var baseUrl = document.location.pathname.replace(new RegExp(reqUrl + '$', 'i'), '');
                if(document.location.port) {
                    result = "//" + document.location.hostname + ":" + document.location.port + baseUrl + "/";
                } else {
                    result = "//" + document.location.hostname + baseUrl + "/";
                }
            }
            document.write("<base href='" + result + "' />");
        }());
    </script>
    <link rel="stylesheet" href="app/third-party/style/source.css"/>
    <link rel="stylesheet" href="app/style/app.css"/>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-38816470-2"></script>

</head>
<body>
<script>
    // check to get production analytics only
    window.PROD_ENV = location.host === "tomitribe.io";
    if (window.PROD_ENV) {
        window.GA_ID = 'UA-38816470-2';
        window.dataLayer = window.dataLayer || [];
        function gtag() {dataLayer.push(arguments);}
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', window.GA_ID, { 'send_page_view': false });
    }
</script>
<ng-view autoscroll="true"></ng-view>
<script type="text/javascript" src="app/third-party/source.js"></script>
<script type="text/javascript" src="app/js/app.min.js"></script>
</body>
</html>
