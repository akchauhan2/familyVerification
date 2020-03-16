define([
        "dojo/dom",
        "esri/layers/FeatureLayer",
        "define/createfamilyGroup"
    ],
    function(dom, FeatureLayer, createfamilyGroup) {
        return {
            returnFunction: function(blocktown) {
                hideFamilyTable()
                $("#wardVillData").remove()
                $("#familyGroup").remove()
                runLoader()
                var wardVillData = document.createElement("div")
                wardVillData.id = "wardVillData"
                wardVillData.className = "d-none mtm-20 opacity-0"

                $(".content").append(wardVillData)


                correctionLayer.queryFeatures({
                    where: "blocktown = '" + blocktown + "' " + queryOptions(),
                    outFields: ["wardvillage"],
                    orderByFields: "wardvillage",
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
                        option.append(document.createTextNode(att.attributes.wardvillage))
                        option.value = att.attributes.wardvillage
                        select.append(option)
                    })

                    select.addEventListener("change", async function(e) {
                        // $("#familyData").remove()
                        runLoader()
                        var wardvillage = e.target.value
                        await countCorrections(correctionLayer, {
                            where: "wardvillage = '" + wardvillage + "'   " + queryOptions()
                        }).then(function(c) {


                            $("#wardVillCountBox").text(c)
                                // focusMap(familyLayer, {
                                //     where: "wardvillage = '" + wardvillage + "'   " + queryOptions(),
                                //     returnGeometry: true
                                // })

                            endLoader()

                            createfamilyGroup.returnFunction(blocktown, wardvillage)
                        })
                    })




                    wardVillData.append(createCountBox("Ward Villages", select))


                    countCorrections(correctionLayer, {
                        where: "wardvillage = '" + select[0].value + "'  " + queryOptions()
                    }).then(function(r) {



                        var h3 = document.createElement('h5')
                        h3.id = "wardVillCountBox"
                        h3.append(document.createTextNode(r))
                        wardVillData.append(createCountBox('correction-check', h3))
                        wardVillData.className = "d-flex transition mtm-20 opacity-1"
                        requestAnimationFrame(() => {
                            wardVillData.classList.add("mt-0")
                            wardVillData.classList.add("opacity-1")
                        });
                        endLoader()
                        createfamilyGroup.returnFunction(blocktown, select[0].value)

                    })
                })
            }
        }
    })