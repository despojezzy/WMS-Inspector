
WMSInspector.AddServiceTypeDialog = {
    
    serviceTypes: window.opener.WMSInspector.OptionsDialog.serviceTypes,

    serviceTypeId: false,

    init: function(){
        this.prefs = WMSInspector.Utils.getPrefs();

        if (window.arguments) this.serviceTypeId = window.arguments[0];

        if (this.serviceTypeId !== false){

            //Edit an existing service

            //Change dialog title
            document.title = WMSInspector.Utils.getString("wi_addservicetype_editservicetypetitle");

            //Get service type details
            for (let i = 0; i < this.serviceTypes.length;i++){
                if (this.serviceTypes[i].id == this.serviceTypeId) {
                  this.fetchDetails(this.serviceTypes[i]) ;
                  break;
                }
            }

        }

    },

    fetchDetails: function(serviceType){

        document.getElementById("wiAddServiceTypeName").value = serviceType.name;
        document.getElementById("wiAddServiceTypeTitle").value = serviceType.title;
        document.getElementById("wiAddServiceTypeDefault").value = serviceType.defaultversion;
        document.getElementById("wiAddServiceTypeVersions").value = serviceType.versions.join(",");

    },


    
    onAccept: function(){

        var name = document.getElementById("wiAddServiceTypeName").value;
        var title = document.getElementById("wiAddServiceTypeTitle").value;
        var defaultVersion = document.getElementById("wiAddServiceTypeDefault").value;
        var versions = WMSInspector.Utils.getValuesFromCSVTextbox(document.getElementById("wiAddServiceTypeVersions"));

        if (!name || !title || !defaultVersion || versions.length == 0){
            WMSInspector.Utils.showAlert(WMSInspector.Utils.getString("wi_fillallfields"));
            return false;
        } else {
            var exists = false;
            for (let i=0; i < versions.length; i++) {
                if (versions[i] == defaultVersion){
                    exists = true;
                    break;
                }
            }
            if (!exists){
                WMSInspector.Utils.showAlert(WMSInspector.Utils.getString("wi_addservicetype_defaultversionnotpresent"));
                return false;
            }
        }

        var serviceType = new window.opener.WMSInspector.ServiceType();

        serviceType.id = WMSInspector.AddServiceTypeDialog.serviceTypeId;
        serviceType.name = name;
        serviceType.title = title;
        serviceType.defaultversion = defaultVersion;
        serviceType.versions = versions;

        if (WMSInspector.AddServiceTypeDialog.serviceTypeId){
            //Update an existing service type
            window.opener.WMSInspector.OptionsDialog.updateServiceType(serviceType);
        } else {
            //Add a new service type to the DB
            window.opener.WMSInspector.OptionsDialog.addServiceType(serviceType);
        }

        window.close();
        return true;

    }
}
