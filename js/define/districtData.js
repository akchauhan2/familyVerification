define([
        "dojo/dom",
        "esri/layers/FeatureLayer",
        "define/createBlocks"
    ],
    function(dom, FeatureLayer, createBlocks) {
        return {
            returnFunction: function() {
                hideFamilyTable()
                $("#countData").remove()
                $("#blockData").remove()
                $("#wardVillData").remove()
                $("#familyGroup").remove()
                countCorrections(correctionLayer, {
                    where: "1=1 " + queryOptions()
                }).then((count) => {
                    $("#totalCorrCount").text(count)
                    if (!queryWith.remark5) {
                        var name = 'All'
                    } else {
                        var name = queryWith.remark5
                    }
                    $("#totalCorrBy").text("by " + name + " in all Districts")
                })

                correctionLayer.queryFeatures({
                    where: "1=1 " + queryOptions(),
                    outFields: ["district"],
                    orderByFields: "district",
                    returnDistinctValues: true
                }).then(function(res) {

                    var data = []
                    res.features.forEach(function(response) {
                        data.push(response)
                    })
                    var select = document.createElement('select')
                    select.className = "countselect browser-default custom-select"

                    // $(".content").append(select)

                    data.forEach(function(att) {
                        var option = document.createElement('option')
                        option.append(document.createTextNode(att.attributes.district))
                        option.value = att.attributes.district
                        option.setAttribute("distrcit_name", att.attributes.district)
                        select.append(option)
                    })

                    select.addEventListener("change", async function(e) {
                        runLoader()
                        var district = e.target.value
                        await countCorrections(correctionLayer, {
                            where: "district = '" + district + "' " + queryOptions()
                        }).then(function(c) {
                            console.log(c);

                            $("#districtCountBox").text(c)
                                // focusMap(familyLayer, {
                                //     where: "district = '" + district + "'  " + queryOptions(),
                                //     returnGeometry: true
                                // })
                            $("#blockData").remove()
                            endLoader()
                            createBlocks.returnFunction(district)
                        })
                    })
                    var countData = document.createElement("div")
                    countData.id = "countData"
                    countData.className = "d-none mtm-20 opacity-0"

                    $(".content").append(countData)

                    $("#countData").prepend(createCountBox("Districts", select))


                    countCorrections(correctionLayer, {
                        where: "district = '" + select[0].value + "'  " + queryOptions()
                    }).then(function(r) {


                        var h3 = document.createElement('h5')
                        h3.id = "districtCountBox"
                        h3.append(document.createTextNode(r))
                        $("#countData").append(createCountBox('correction-check', h3))

                        $(".content").css({ "margin": 0 })
                        countData.className = "d-flex transition mtm-20"
                        requestAnimationFrame(() => {
                            countData.classList.add("mt-0")
                            countData.classList.add("opacity-1")
                        });
                        endLoader()
                        createBlocks.returnFunction(select[0].value)
                    })

                })
            }
        }
    })