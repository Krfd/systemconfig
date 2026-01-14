function load_useraccount(){$.post("registry/hr/useraccount/useraccount.php", { }, function (data) { $(".container").html(data);});}
function load_case(){$.post("registry/hr/case/case.php", { }, function (data) { $(".container").html(data);});}
function load_victim(){$.post("registry/hr/victim/victim.php", { }, function (data) { $(".container").html(data);});}
function load_suspect(){$.post("registry/hr/suspect/suspect.php", { }, function (data) { $(".container").html(data);});}
function load_investigator(){$.post("registry/hr/investigator/investigator.php", { }, function (data) { $(".container").html(data);});}
function load_prosecutor(){$.post("registry/hr/prosecutor/prosecutor.php", { }, function (data) { $(".container").html(data);});}

function load_case_investigation(){$.post("module/case_investigation/case_investigation.php", { }, function (data) { $(".container").html(data);});}

function load_case_inv_monitoring(){$.post("dashboard/case_with_number_of_suspect/case_investigation_monitoring.php", { }, function (data) { $(".container").html(data);});}
function load_case_and_company_info(){$.post("dashboard/case_and_company_info/case_and_company_info.php", { }, function (data) { $(".container").html(data);});}

function load_of_suspect_case_inv(){$.post("report/list_of_suspect_case/list_of_suspect_case.php", { }, function (data) { $(".container").html(data);});}