// setup.js

function markdownExport() {
    $.get("/md/"+currentPage.pageName, function(data) {
        console.log(data);
    });
}

