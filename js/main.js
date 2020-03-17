require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/widgets/Locate",
    "esri/layers/FeatureLayer",
    "define/districtData",
    "esri/tasks/support/StatisticDefinition",
    "esri/tasks/support/Query"
], function(Map, MapView, Locator, FeatureLayer, districtData, StatisticDefinition, Query) {
    window.map = new Map({
        basemap: "satellite"
    });

    window.view = new MapView({
        container: "viewDiv",
        map: map,
        center: [37, 95]
    });


    view.when(() => {
        view.ui.remove(["navigation-toggle", "compass"])
    })
    var locate = new Locator({
        view: view
    });
    view.ui.add(locate, "top-left");
    runLoader()

    window.queryWith = {}

    window.queryOptions = () => {
        var query = ''
        var keys = Object.keys(queryWith)
        keys.forEach(function(key) {
            query += " AND  " + key + " = '" + queryWith[key] + "'"
        })
        return "  AND remark3 = 'Y' " + query
    }

    window.familyLayer = new FeatureLayer({
        url: config.familyLayer,
        // definitionExpression: "user_type_ = 'family_verification'",

        popupTemplate: {
            title: '<b>{name}</b>',
            content: function(g) {
                return g.graphic.attributes.name
            }
        }
    });

    correctionLayer = new FeatureLayer({
        url: config.correctionLayer,
        // definitionExpression: "user_type_ = 'family_verification'"
    });

    map.add(familyLayer);
    familyLayer.renderer = {
        type: "simple",
        symbol: {
            type: "simple-marker",
            size: 10,
            color: "#b23",
            outline: {
                width: 1.2,
                color: "##369"
            }
        },
    };


    correctionLayer.queryFeatures({
        where: "1=1 AND remark3 = 'Y'",
        outFields: ["remark5"],
        orderByFields: "remark5",
        returnDistinctValues: true
    }).then(async function(result) {
        var select = $("#doneBy")

        var option = document.createElement("option")
        option.innerHTML = "Corrected By"
        option.setAttribute("disabled", true)
        option.setAttribute("selected", true)
        select.append(option)
            //For All users
        var option = document.createElement("option")
        option.innerHTML = "All"
        option.value = "All"
        select.append(option)

        await result.features.forEach(function(features) {


            var option = document.createElement("option")
            option.value = features.attributes.remark5
            option.innerHTML = features.attributes.remark5
            select.append(option)
        })

        select.change(function(e) {
            selected = e.target.value
            queryWith.remark5 = selected
            queryWith.remark5 == "All" ? delete queryWith.remark5 : ''
            districtData.returnFunction(correctionLayer)
        })
        districtData.returnFunction(correctionLayer)
    })


    window.countCorrections = async(layer, query) => {
        return await layer.queryFeatureCount(query)
    }

    window.focusMap = (layer, query) => {

        layer.queryExtent(query).then(function(ext) {
            view.goTo(ext.extent)
        })
    }

    familyLayer
        .when(function() {
            return familyLayer.queryExtent();
        })
        .then(function(response) {
            view.goTo(response.extent).then(function() {
                view.scale = view.scale / .9
            })
        });

    window.createCountBox = (title, select) => {

        var span = document.createElement('span')
        span.className = "countSpan text-center"
        var h2 = document.createElement('h2')
        if (title == 'correction-check') {
            h2.append(document.createTextNode('\uf46c'))
            h2.className = "fa fa-2x text-success"
            h2.setAttribute("title", "Corrections Done")
        } else {
            h2.append(document.createTextNode(title))
        }
        span.append(h2)
        span.append(select)
        return span
    }




    var labels = []
    correctionLayer.queryFeatures({
        where: "1=1 AND remark3 = 'Y'",
        outFields: ["remark5"],
        orderByFields: "remark5",
        returnDistinctValues: true
    }).then(async function(results) {
        await results.features.forEach(async function(label) {
            await labels.push(label.attributes.remark5)
        })

        var data = []

        labels.forEach((label) => {
            correctionLayer.queryFeatureCount({
                where: "1=1 AND remark3 = 'Y' AND remark5= '" + label + "'",
                outFields: ["remark5"]
            }).then(function(results) {
                data.push(results)
                var colors = []
                var borders = []
                for (i = 0; i < data.length; i++) {
                    colors.push(randomcol(0.3))
                }

                colors.forEach(function(c) {
                    x = c.replace("0.3", "1")
                    borders.push(x)
                })


                $("#theChartDiv").toggle("slow")
                var ctx = document.getElementById('theChartCanvas').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels,
                        datasets: [{
                            label: '# of Corrections',
                            data,
                            backgroundColor: colors,
                            borderColor: borders,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

            })
        })



    })


});