if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function IGPM(){
    
    this.initYearListener();
    this.initCauculateListener();
    this.apiBaseUrl = "http://imob.io/api/igpm/{0}.json?no-cache=" + Math.random();
    
    this.addTips();
    $('#value').autoNumeric('init', {aDec: ",", aSep: "."});
    
};
IGPM.prototype.addTips = function(){
    $('[data-toggle="tooltip"]').tooltip();
};

IGPM.prototype.loadTable = function(year){
    
    var url = this.apiBaseUrl.format(year);
    var _this = this;
    
    $("#data").empty();
    
    $.get(url, function (data) {
        
        var options = { maximumFractionDigits: 2,minimumFractionDigits: 2 };
        $.each(data,function(key,item){
            var row = $("#row-template").html();
            var value = item.value.toLocaleString('pt-br',options);
            var year_total = item.year_total.toLocaleString('pt-br',options);
            var last_months_total = item.last_months_total.toLocaleString('pt-br',options);
            $("#data").append(row.format(item.last_months_total,item.date,value,year_total,last_months_total));
        });
        
        _this.addTips();
         
    }, 'json');
    
};

IGPM.prototype.loadTables = function(onLoad){
    
    var url = this.apiBaseUrl.format("tables");
    
    $.get(url, function (tables) {
    
       tables.map(function(year){
            $("#year").append("<option>{0}</option>".format(year));
       });
         
       onLoad(tables);
       
    }, 'json');
    
};

IGPM.prototype.initCauculateListener = function(){
    
    $(document).on("click",".btn-cauculate",function(){
        
        var lastMonthsTotal = parseFloat($(this).attr("data-last-months-total"));
        var value = parseFloat("0" + $("#value").val().replace(".","").replace(",","."));
        var newValue = (value + (value * lastMonthsTotal / 100));
        $("#new-value").html(newValue.toLocaleString('pt-br',{ maximumFractionDigits: 2,minimumFractionDigits: 2 }));
    });
    
};
IGPM.prototype.initYearListener = function(){
    
    var _this = this;
    
    $("#year").change(function(){
       
        var year = $(this).val();
        _this.loadTable(year);
        
    });
    
};

$(document).ready(function () {
    
    var igpm = new IGPM();
     
    igpm.loadTables(function(years){
        
        igpm.loadTable(years[0]);
        
    });

});