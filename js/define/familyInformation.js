define([
        "dojo/dom",
        "esri/layers/FeatureLayer",
    ],
    function(dom, FeatureLayer) {
        return {
            returnFunction: function(familyId) {
                runLoader()
                correctionLayer.queryFeatures({
                    where: "familyid = '" + familyId + "' " + queryOptions(),
                    outFields: ["*"],
                    orderByFields: ["id desc"]
                }).then(function(result) {
                    var tableDiv = $("#familyTableBody")
                    var data = []
                    var columns = []
                        /*
                                    //for All Columns
                                    Object.keys(result.features[0].attributes).forEach((key) => {
                                        columns.push({ "title": key })
                                    })


                                    result.features.forEach(element => {
                                        var oneData = []
                                        columns.forEach(function(key) {
                                            (element.attributes[key] === null ? oneData.push(0) : oneData.push(element.attributes[key.title]))

                                        })
                                        data.push(oneData)
                                    });
                        */

                    /*
                                //For Selected Columns
                    */

                    // "objectid,id,familyid,tempfamilyid,pariwarmemberid,name,lastname,nameinhindi,lastnameinhindi,fathername,fathelastname,fathernameinhindi,fatherlastnameinhindi,mothername,motherlastname,mothernameinhindi,motherlastnameinhindi,gender,age,dateofbirth,relationwithhead,maritalstatus,spousename,spouselastname,spousenameinhindi,spouselastnameinhindi,eid,aadhaarnumber,mobilenumber,isfamilyhead,housenumber,streetno,landmark,address,districtcode,blocktowncode,wardvillagecode,district,blocktown,wardvillage,pincode,isspeciallyabled,speciallyabledpercentage,castecategory,qualification,email,isincometaxpayer,isgovernmentemployee,isbpl,totallandholding,agriculturalland,isfreedomfighter,isews,totalincome,occupationcode,accountnumber,bankname,ifsccode,f50,branchaddress,createdby,createddate,updateddate,serialno,gisdatecreated,giscreatedby,gisdatemodified,gismodifiedby,remark1,remark2,remark3,remark4,remark5,expired_flag,s_flag,latitude,longitude"

                    // name, lastname, fathername, mothername, gender, age, dateofbirth, relationwithhead, maritalstatus, spousename, speciallyabledpercentage, castecategory, qualification, isgovernmentemployee,totalincome
                    var req_cols = ["name", "lastname", "fathername", "fathelastname", "mothername", "motherlastname", "gender", "age", "dateofbirth", "relationwithhead", "occupationcode", "maritalstatus", "spousename", "spouselastname", "aadhaarnumber", "mobilenumber", "housenumber", "streetno", "address", "district", "blocktown", "wardvillage", "pincode", "isspeciallyabled", "speciallyabledpercentage", "castecategory", "qualification", "email", "isincometaxpayer", "agriculturalland", "totalincome", "totallandholding", "relationwithhead", "maritalstatus"]

                    req_cols.forEach(function(col) {
                        columns.push({ title: col })
                    })

                    // columns.push({ title: "name" }, { title: "lastname" }, { title: "fathername" }, { title: "mothername" }, { title: "gender" }, { title: "age" }, { title: "dateofbirth" }, { title: "relationwithhead" }, { title: "maritalstatus" }, { title: "spousename" }, { title: "speciallyabledpercentage" }, { title: "castecategory" }, { title: "qualification" }, { title: "isgovernmentemployee" }, { title: "totalincome" })

                    result.features.forEach(element => {
                        var oneData = []
                        columns.forEach(async(key) => {
                            var value = (element.attributes[key.title])
                            await ((value === null || value === 'null') ? oneData.push('_') : oneData.push(value))
                        })
                        data.push(oneData)
                    });
                    //Selected Columns Ends here

                    endLoader()

                    showFamilyTable()
                    createDataTable(tableDiv, columns, data)
                })


                function createDataTable(tableDiv, columns, data) {

                    tableDiv.dataTable({
                        data,
                        columns,
                        destroy: true,
                        paging: false,
                        info: false,
                        scrollX: true,
                        search: false
                    });
                }

            }
        }
    })