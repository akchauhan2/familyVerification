define([
        "dojo/dom",
        "esri/layers/FeatureLayer",
        "define/createVillWards"
    ],
    function(dom, FeatureLayer, createVillWards) {
        return {
            returnFunction: function(district) {
                hideFamilyTable()
                $("#blockData").remove()
                $("#wardVillData").remove()
                $("#familyGroup").remove()
                runLoader()

                var blockData = document.createElement("div")
                blockData.id = "blockData"
                blockData.className = "d-none mtm-20 opacity-0"

                $(".content").append(blockData)


                correctionLayer.queryFeatures({
                    where: "district = '" + district + "' " + queryOptions(),
                    outFields: ["blocktown"],
                    orderByFields: "blocktown",
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
                        option.append(document.createTextNode(att.attributes.blocktown))
                        option.value = att.attributes.blocktown
                        select.append(option)
                    })

                    select.addEventListener("change", async function(e) {
                        $("#wardVillData").remove()
                        runLoader()
                        var blocktown = e.target.value
                        await countCorrections(correctionLayer, {
                            where: "blocktown = '" + blocktown + "'  " + queryOptions()
                        }).then(function(c) {


                            $("#blockCountBox").text(c)
                                // focusMap(familyLayer, {
                                //     where: "blocktown = '" + blocktown + "'",
                                //     returnGeometry: true
                                // })


                            $("#createVillWards").remove()
                            createVillWards.returnFunction(blocktown)

                            endLoader()
                        })
                    })

                    blockData.append(createCountBox("Blocks", select))

                    countCorrections(correctionLayer, {
                        where: "blocktown = '" + select[0].value + "'  " + queryOptions()
                    }).then(function(r) {
                        var h3 = document.createElement('h5')
                        h3.id = "blockCountBox"
                        h3.append(document.createTextNode(r))
                        blockData.append(createCountBox('correction-check', h3))
                        blockData.className = "d-flex transition mtm-20"
                        requestAnimationFrame(() => {
                            blockData.classList.add("mt-0")
                            blockData.classList.add("opacity-1")
                        });
                        endLoader()
                        createVillWards.returnFunction(select[0].value)

                    })



                })

            }
        }
    })