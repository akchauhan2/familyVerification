define([
        "dojo/dom",
        "esri/layers/FeatureLayer",
        "define/familyInformation"
    ],
    function(dom, FeatureLayer, familyInformation) {
        return {
            returnFunction: function(blocktown, wardvillage) {
                hideFamilyTable()
                $("#familyGroup").remove()
                runLoader()
                var familyGroup = document.createElement("div")
                familyGroup.id = "familyGroup"
                familyGroup.className = "d-none mtm-20 opacity-0"

                $(".content").append(familyGroup)


                correctionLayer.queryFeatures({
                    where: "blocktown = '" + blocktown + "' AND wardvillage = '" + wardvillage + "' " + queryOptions(),
                    outFields: ["familyid"],
                    orderByFields: "familyid",
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
                        option.append(document.createTextNode(att.attributes.familyid))
                        option.value = att.attributes.familyid
                        select.append(option)
                    })

                    select.addEventListener("change", async function(e) {
                        // $("#familyData").remove()
                        runLoader()
                        var familyid = e.target.value
                        await countCorrections(correctionLayer, {
                            where: "familyid = '" + familyid + "'   " + queryOptions()
                        }).then(function(c) {


                            $("#wardVillCountBox").text(c)
                                // focusMap(familyLayer, {
                                //     where: "familyid = '" + familyid + "'   " + queryOptions(),
                                //     returnGeometry: true
                                // })

                            endLoader()
                            familyInformation.returnFunction(familyid)
                        })
                    })




                    familyGroup.append(createCountBox("Family ID", select))


                    countCorrections(correctionLayer, {
                        where: "familyid = '" + select[0].value + "'  " + queryOptions()
                    }).then(function(r) {
                        var h3 = document.createElement('h5')
                        h3.id = "familyIdCount"
                        h3.append(document.createTextNode(r))
                        familyGroup.append(createCountBox('correction-check', h3))
                        familyGroup.className = "d-flex transition mtm-20"
                        requestAnimationFrame(() => {
                            familyGroup.classList.add("mt-0")
                            familyGroup.classList.add("opacity-1")
                        });
                        endLoader()
                    })


                    familyInformation.returnFunction(select[0].value)

                })


            }
        }
    })