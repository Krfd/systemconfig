
$(document).ready(function(){
    loadBranchSetup();
});



function loadBranchSetup() {
    $.post("dirs/store_master/components/main.php", {
    }, function (data){
        $("#load_Branchsetup").html(data);
        loadBranchStore();
        loadMyBranches();
    });
}


/*Function load all Branches*/
function loadBranchStore() {
  $.post("dirs/store_master/actions/get_branches.php", {}, function(data) {
    const response = JSON.parse(data);
    if ($.trim(response.isSuccess) === "success") {
      const branches = response.Data;
      $("#filter-branch").html('<option selected value="">Branch</option>');
      branches.forEach(branch => {
        $("#filter-branch").append(
          $("<option>", {
            value: branch.Branch,
            text: branch.Branch
          })
        );
      });
    } else {
      alert($.trim(response.Data));
    }
  });
}

/*Function create branch modal*/

function addBranch() {
    $("#mdl-add-branch").modal("show");
    $("#btn-draft").removeClass('d-none');
    $.post("dirs/store_master/actions/get_bcode.php", {}, function (data) {
        let response = JSON.parse(data);

        if (response.isSuccess === "success") {

            /* ===== Populate datalist ===== */
            let options = "";
            if (response.Acronyms && response.Acronyms.length > 0) {
                response.Acronyms.forEach(function (acr) {
                    options += `<option value="${acr}"></option>`;
                });
            }
            $("#branchAcronymList").html(options);

            /* ===== Branch number series ===== */
            if (!response.Data || !response.Data.B_Code) {
                nextBranchNumber = "001";
            } else {
                let match = response.Data.B_Code.match(/(\d{3})$/);
                let num = match ? parseInt(match[1], 10) + 1 : 1;
                nextBranchNumber = num.toString().padStart(3, "0");
            }

            loadBCode();
        } else {
            alert(response.Data);
        }
    });
}



$("#branchacronym").on("input", loadBCode);


function loadBCode() {
    let acronym = $("#branchacronym").val();
    if (!acronym || acronym.trim() === "") {
        $("#branchcode").val("");
        return;
    }

    acronym = acronym.toUpperCase().trim();
    $("#branchcode").val(acronym + nextBranchNumber);
}

/*Function to reset form when closed*/
function loadCancel() {
    $("#btn-clear").click(); // triggers the click event
}



/*Submit Form upon creating Branch*/
$("#frm-add-branch").submit(function(event){
    event.preventDefault();
    var Bcode = $("#branchcode").val();
    var Bsize = $("#branchtype").val();
    var Outlettype = $("#outlettype").val();
    var OwnerType = $("#ownership_type").val();
    var Franchisee = $("#franchisee_name").val();
    var FAgreement = $("#franchise_agreement_no").val();
    var FranchiseDate = $("#franchise_start_date").val();
    var Royalty = $("#royalty_rate").val();
    var Marketing = $("#marketing_fee").val();
    var BAdress = $("#address").val();
    var Region = $("#region").val();
    var Province = $("#province").val();
    var City = $("#city").val();
    var Zipcode = $("#zipcode").val();
    var Email = $("#email").val();
    var Phonenumber = $("#phonenumber").val();
    var Opening = $("#openingdate").val();
    var POS = $("#pos_enabled").val();
    var Bstatus = $("#status").val();
    var DraftFile = $("#draft-id").val();

    $.post("dirs/store_master/actions/save_branch.php", {
        Bcode: Bcode,
        Bsize: Bsize,
        Outlettype: Outlettype,
        OwnerType: OwnerType,
        Franchisee: Franchisee,
        FranchiseDate: FranchiseDate,
        FAgreement: FAgreement,
        Royalty: Royalty,
        Marketing: Marketing,
        BAdress: BAdress,
        Region: Region,
        Province: Province,
        City: City,
        Zipcode: Zipcode,
        Email: Email,
        Phonenumber: Phonenumber,
        Opening: Opening,
        POS: POS,
        Bstatus: Bstatus,
        DraftFile: DraftFile,
    }, function(data){
        if($.trim(data) == "OK"){
            loadBranchSetup();
           $("#frm-add-branch")[0].reset();
            $("#mdl-add-branch").modal('hide');
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Great! New branch.",
                timer: 2000,
                showConfirmButton: false
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Error",
                text: data,
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});



/*Function save draft base on user login*/
function saveDraft(){
    var Bacronym = $("#branchacronym").val();
    var Bsize = $("#branchtype").val();
    var Outlettype = $("#outlettype").val();
    var OwnerType = $("#ownership_type").val();
    var Franchisee = $("#franchisee_name").val();
    var FAgreement = $("#franchise_agreement_no").val();
    var FranchiseDate = $("#franchise_start_date").val();
    var Royalty = $("#royalty_rate").val();
    var Marketing = $("#marketing_fee").val();
    var BAdress = $("#address").val();
    var Region = $("#region").val();
    var Province = $("#province").val();
    var City = $("#city").val();
    var Zipcode = $("#zipcode").val();
    var Email = $("#email").val();
    var Phonenumber = $("#phonenumber").val();
    var Opening = $("#openingdate").val();
    var POS = $("#pos_enabled").val();
    var Bstatus = $("#status").val();

    $.post("dirs/store_master/actions/save_draft.php", {
        Bacronym: Bacronym,
        Bsize: Bsize,
        Outlettype: Outlettype,
        OwnerType: OwnerType,
        Franchisee: Franchisee,
        FranchiseDate: FranchiseDate,
        FAgreement: FAgreement,
        Royalty: Royalty,
        Marketing: Marketing,
        BAdress: BAdress,
        Region: Region,
        Province: Province,
        City: City,
        Zipcode: Zipcode,
        Email: Email,
        Phonenumber: Phonenumber,
        Opening: Opening,
        POS: POS,
        Bstatus: Bstatus,
    }, function(data){
        let response;
        try {
            response = JSON.parse(data);
        } catch(e) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Invalid server response",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        if(response.isSuccess === "success"){
            loadBranchSetup();
            $("#frm-add-branch")[0].reset();
            $("#mdl-add-branch").modal('hide');
            var el = $('#mdl-drafts')[0];
             var instance = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
            instance.hide();

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Draft saved.",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.message || "Failed to save draft",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}


/*Function load all drafts*/
function loadDrafts() {
    var el = $('#mdl-drafts')[0];
    var instance = bootstrap.Offcanvas.getInstance(el);
    if (!instance) {
        instance = new bootstrap.Offcanvas(el);
    }
    instance.show();

    $.post(
        "dirs/store_master/actions/get_drafts.php",
        {},
        function (response) {

            const $list = $("#draft-list");
            $list.empty();

            if (response.isSuccess === "success" && response.Data.length) {

                response.Data.forEach((draft, i) => {
                    $list.append(`
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                                <div class="fw-bold">Draft ${i + 1}</div>
                                <small class="text-muted">${draft.datetime}</small>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-1"
                                    onclick="applyDraft('${draft.file}')">Apply</button>
                                <button class="btn btn-sm btn-outline-danger"
                                    onclick="deleteDraft('${draft.file}')">Delete</button>
                            </div>
                        </li>
                    `);
                });

            } else {
                $list.append(`
                    <li class="list-group-item text-center text-muted">
                        No draft record
                    </li>
                `);
            }
        },
        "json"
    );
}


/*Function to delete the draft*/
function deleteDraft(draftFile) {
    $.post(
        "dirs/store_master/actions/delete_draft.php",
        { draft_file: draftFile },
        function (res) {

            if (res.isSuccess === "success") {
                loadDrafts(); 
            } else {
                Swal.fire("Error", res.message, "error");
            }
        },
        "json" 
    );
}



/*Function get Draft for re apply*/
function applyDraft(draftFile) {
    $.post(
        "dirs/store_master/actions/get_file.php",
        { draft_file: draftFile },
        function (response) {

            if (response.isSuccess === "success") {
                const d = response.Data.branch;

                $("#branchacronym").val(d.Bacronym);
                $("#branchtype").val(d.Bsize);
                $("#outlettype").val(d.Outlettype);
                $("#ownership_type").val(d.OwnerType);

                $("#franchisee_name").val(d.Franchisee);
                $("#franchise_agreement_no").val(d.FAgreement);
                $("#franchise_start_date").val(d.FranchiseDate);
                $("#royalty_rate").val(d.Royalty);

                $("#marketing_fee").val(d.Marketing);
                $("#address").val(d.Address.BAdress);
                $("#region").val(d.Address.Region);
                $("#province").val(d.Address.Province);

                $("#city").val(d.Address.City);
                $("#zipcode").val(d.Address.Zipcode);
                $("#email").val(d.Contact.Email);
                $("#phonenumber").val(d.Contact.Phonenumber);

                $("#openingdate").val(d.Opening);
                $("#pos_enabled").val(d.POS);
                $("#status").val(d.Status);
                $("#draft-id").val(draftFile);

                if (d.OwnerType == 'FRANCHISE') {
                    $("#franchise-section").removeClass('d-none');
                } else {
                    $("#franchise-section").addClass('d-none');
                }


                $("#mdl-add-branch").modal("show");

                addBranch();
                $("#btn-draft").addClass('d-none');

            } else {
                Swal.fire("Error", response.message, "error");
            }

        },
        "json" // 👈 IMPORTANT
    );
}


/*Function show branch information 1 by 1*/
function loadBData(Bid) {
    $.post("dirs/store_master/actions/get_location.php", { Bid: Bid }, function(data) {
        var response = JSON.parse(data);

        if ($.trim(response.isSuccess) === "success") {

          $("#branch-province").val(response.Data.Province);
          $("#branch-code").val(response.Data.B_Code);
          $("#branch-type").val(response.Data.B_Type);
          $("#branch-status").val(response.Data.Status);
          $("#branch-address").val(response.Data.Address);
          $("#branch-email").val(response.Data.Email);
          $("#branch-phnumber").val(response.Data.Phonenumber);
          $("#branch-opening").val(response.Data.OpenedDate);
          $("#branch-franchise").val(response.Data.Franchisee);
          $("#branch-fdate").val(response.Data.FranchiseDate);


            var lat = parseFloat(response.Data.Latitude);
            var lng = parseFloat(response.Data.Longitude);

            if (isNaN(lat) || isNaN(lng)) {
                alert("Invalid coordinates received.");
                return;
            }

            $("#latitude").val(lat.toFixed(7));
            $("#longitude").val(lng.toFixed(7));
            window.branchLat = lat;
            window.branchLng = lng;
            window.branchBid = Bid;
            $("#mdl-branch-profile").modal("show");

        } else {
            alert($.trim(response.Data));
        }
    });
}

var branchMap, branchMarker;
$('#mdl-branch-profile').on('shown.bs.modal', function () {
    if (branchMap) {
        branchMap.remove();
        branchMap = null;
    }
    branchMap = L.map('map').setView([window.branchLat, window.branchLng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(branchMap);
    branchMarker = L.marker(
        [window.branchLat, window.branchLng],
        { draggable: true }
    )
    .addTo(branchMap)
    .bindPopup("Bo's Café #" + window.branchBid)
    .openPopup();
    branchMarker.on('dragend', function (e) {
        const pos = e.target.getLatLng();
        $("#latitude").val(pos.lat.toFixed(7));
        $("#longitude").val(pos.lng.toFixed(7));
    });
    setTimeout(() => {
        branchMap.invalidateSize();
    }, 200);
});


/*Viewing for all branches*/

var branchMap = null;
var markers = [];

// Initialize map ONCE
function initMap() {
    if (branchMap) return;
    branchMap = L.map('map-branches').setView([12.8797, 121.7740], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(branchMap);
}

// Load all branches + pins + cards
function loadAllBranches() {
    $("#load_Branchsetup").addClass('d-none');
    initMap();
    $.post("dirs/store_master/actions/get_allbranches.php", {}, function (data) {
        var response;
        try {
            response = JSON.parse(data);
        } catch (e) {
            console.error("Invalid JSON response");
            return;
        }
        if ($.trim(response.isSuccess) !== "success") {
            console.log(response.Data);
            return;
        }
        const branches = response.Data;
        const container = $("#load-branches");
        container.empty();
        markers.forEach(m => branchMap.removeLayer(m));
        markers = [];

        const boundsGroup = L.featureGroup();

        if (!branches || branches.length === 0) {
            container.html(`
                <div class="text-center text-muted py-4">
                    No branches available
                </div>
            `);
            return;
        }

        branches.forEach(branch => {

            const lat = parseFloat(branch.Latitude);
            const lng = parseFloat(branch.Longitude);

            // Ignore NULL or invalid coordinates
            if (isNaN(lat) || isNaN(lng)) return;

            // MAP MARKER
            const marker = L.marker([lat, lng])
                .bindPopup(`
                    <strong>Bo's Café #${branch.Bid}</strong><br>
                    ${branch.Province}
                `);


            marker.addTo(branchMap);
            boundsGroup.addLayer(marker);
            markers.push(marker);

            // BRANCH CARD
            const card = $(`
                <div class="col-md-6">
                    <div class="card shadow-sm h-100 branch-card" style="cursor:pointer">
                        <div class="card-body">
                            <h6 class="fw-bold mb-1">${branch.Province}</h6>
                            <small class="text-muted">Branch ID: ${branch.Bid}</small>
                        </div>
                    </div>
                </div>
            `);

            card.on("click", function () {
                branchMap.setView([lat, lng], 15);
                marker.openPopup();
            });

            container.append(card);
        });

        // Auto-fit map to all markers
        if (boundsGroup.getLayers().length > 0) {
            branchMap.fitBounds(boundsGroup.getBounds().pad(0.2));
        }

        // Fix tile rendering edge cases
        setTimeout(() => {
            branchMap.invalidateSize();
        }, 200);

    });
}



function loadEdit() {
    $("#mdl-add-branch").modal('show');
    $("#mdl-branch-profile").modal('hide');
    $("#btn-clear").addClass('d-none');
    $("#btn-draft").addClass('d-none');
    $("#mdl-title").text("Update Branch");
    $("#branchacronym").prop('readonly', true).removeClass("border-success");


}