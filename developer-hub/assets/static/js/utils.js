var header = new Headroom(document.querySelector("#topbar"), {
    tolerance: 5,
    offset: 80
});

document.addEventListener("DOMContentLoaded", function () {
    header.init()
})