$(function() {
    $("#viewDiv").innerHeight(
        $("body").innerHeight() -
        $("header").innerHeight() -
        $("footer").innerHeight()
    );
    $("section#main").innerHeight(
        $("body").innerHeight() -
        $("header").innerHeight() -
        $("footer").innerHeight()
    );
})

const runLoader = () => {
    $("#loader").show()
}
const endLoader = () => {
    $("#loader").hide()
}

const showFamilyTable = () => {
    var table = document.getElementById("familyInfo");
    table.className = "opacity-0"

    requestAnimationFrame(() => {
        table.classList.add("opacity-1")
        document.getElementsByClassName("container")[0].scrollTo(0, document.getElementsByClassName("container")[0].offsetHeight)
    });
}

const hideFamilyTable = () => {
    var table = document.getElementById("familyInfo");
    table.className = "d-none transition opacity-0"
}

$("#tableTogglebtn").click(function() {
    $("#familyTable").toggle("slow")
})

$("#chartTogglebtn").click(function() {
    $("#theChartDiv").toggle("slow")
})


function randomcol(opacity) {
    var o = Math.round,
        r = Math.random,
        s = 255;
    if (opacity) {
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + .20 + ')';
    } else {
        return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 1 + ')';
    }
}