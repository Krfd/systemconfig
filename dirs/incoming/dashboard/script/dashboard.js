$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });

  $(".checkbox").hide();
});

function loadDashboard() {
  $.post("dirs/incoming/dashboard/components/main.php", {}, function (data) {
    $("#incoming_content").html(data);
  });
}

function handleAddToPicklist() {
  alert("Items added to picklist!");
}

function toggleCheckboxes() {
  const createPicklistBtn = document.getElementById("createPicklistBtn");
  let anyVisible = false;
  const checkedIds = []

  $("#outgoingTable tbody .checkbox:checked").each(function () {
      checkedIds.push(this.id);
  });

  console.log("Checked IDs:", checkedIds);

  $("#outgoingTable tbody tr").each(function () {
    const row = $(this);
    const checkbox = row.find(".checkbox");
    const srnText = row.find("td:eq(2)").text().trim(); // SRN column

    // Only rows with SRN starting with 'SRN' are valid
    if (srnText.startsWith("SRN")) {
      checkbox.toggle();

      if (checkbox.is(":visible")) {
        anyVisible = true;
      } else {
        checkbox.prop("checked", false);
      }
    } else {
      checkbox.hide();
      checkbox.prop("checked", false);
    }
  });

  createPicklistBtn.textContent = anyVisible
    ? "Add to Picklist"
    : "Create Picklist";

    if (anyVisible) {
        createPicklistBtn.type = "submit";
        console.log(`BUTTON TYPE : ${createPicklistBtn.type}`)
        console.log(`CREATED THE PICKLIST`);
        console.log(`NOW CHANGING THE TYPE TO BUTTON`)
    } else {
      createPicklistBtn.type = "button"
      console.log(`BUTTON TYPE : ${createPicklistBtn.type} `);
      
      const params = {
        selectedIds: checkedIds,
        action: "create"
      };

      $.post("dirs/incoming/picklistbasket/basket.php", params, function (data) {
        $("#main-content").html(data);
      });
    }
}

function picklistBasket() {
  $.post("dirs/incoming/picklistbasket/basket.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function openIncoming() {
  $.post("dirs/incoming/form/form.php", {}, function (data) {
    $("#main-content").html(data);
  });
}
