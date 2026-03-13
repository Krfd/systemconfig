$(document).ready(function () {
  if (typeof CURRENT_ROWNUM !== "undefined" && CURRENT_ROWNUM !== "") {
    loadOutgoingDetails(CURRENT_ROWNUM);
  }
});

$(document).ready(function () {
  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function returnOutgoing() {
  $.post("dirs/outgoing/dashboard/outgoing.php", {}, function (data) {
    $("#main-content").html(data);
  });
  window.location.reload();
}

function loadOutgoingDetails(RowNum) {
  $.ajax({
    url: "dirs/outgoing/requests/actions/get_openrequest.php",
    type: "POST",
    data: { RowNum: RowNum },
    dataType: "json",
    success: function (response) {
      if (response.isSuccess === "success") {
        let rowCount = response.Items.length;
        let totalQty = 0;

        let header = response.Data;
        let items = response.Items;

        function selectedValue(selector, value) {
          $(selector)
            .empty()
            .append(`<option value="${value}">${value}</option>`);
        }

        selectedValue("#typeOfReq", header.RequestType);
        selectedValue("#destination", header.Destination);
        selectedValue("#branchWhCode", header.DestinationWhs);
        selectedValue("#origin", header.Origin);
        selectedValue("#whcode", header.OriginWhs);

        // ================= HEADER =================
        $("#srn").val(header.BaseNum_SRN);
        $("#date").val(header.DocDate);
        $("#status").val(header.RequestStatus);
        $("#purpose").val(header.RequestPurpose);
        $("#reqBy").val(header.PrepBy);
        $("#remarks").val(header.Remarks);

        // ================= ITEMS =================
        let rows = "";

        items.forEach(function (item, index) {
          let quantity = parseFloat(item.Quantity) || 0;
          totalQty += quantity;
          rows += `
            <tr>
              <td style="background:#FFFBDF">${index + 1}</td>
              <td style="background:#FFFBDF">${item.Brand}</td>
              <td style="background:#FFFBDF">${item.Model}</td>
              <td style="background:#FFFBDF">${item.Category}</td>
              <td style="background:#FFFBDF">${item.Quantity}</td>
            </tr>
          `;
        });

        $("#totalReqQuantity").text(totalQty);
        $("#openIncomingTable tbody").html(rows);

        if (rowCount < 8) {
          let emptyRowsNeeded = 8 - rowCount;

          for (let i = 0; i < emptyRowsNeeded; i++) {
            let emptyRow = `
              <tr class="item-row empty-row" style="height: 50px; min-height: 50px;">
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
                <td style="background: #FFFBDF"></td>
              </tr>
            `;
            $("#openIncomingTable tbody").append(emptyRow);
          }
          $("#totalQuantity").text(totalQty);
        }
      } else {
        alert(response.Data);
      }
    },
    error: function (xhr) {
      console.error(xhr.responseText);
    },
  });
}
