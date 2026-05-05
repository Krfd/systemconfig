$(document).ready(function () {
  loadDashboard();

  OverlayScrollbars(document.getElementById("dashboard-display"), {
    className: "os-theme-dark",
    scrollbars: {
      autoHide: "leave",
      clickScrolling: true,
    },
  });
});

function loadDashboard() {
  $.post("dirs/load/dashboard/components/main.php", {}, function (data) {
    $("#basket_content").html(data);
    $("#loadingBasketTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
    loadBasket();
  });
}

function loadBasket() {
  $.ajax({
    url: "dirs/load/dashboard/actions/get_loadingbasketdisplay.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let data = response.Data;
      let rows = [];
      let index = 1;

      if (response.isSuccess === "success") {
        // console.log(`LOADING BASKET DATA HERE`);

        let grouped = {};

        data.forEach(function (item, index) {
          // let key = item.Model; // group by Model
          // if (!grouped[key]) {
          //   grouped[key] = {
          //     Brand: item.Brand || "",
          //     Model: item.Model || "",
          //     Category: item.Category || "",
          //     Quantity: 0,
          //   };
          // }
          // grouped[key].Quantity += Math.trunc(Number(item.Actual_Quantity) || 0);

          const isDisabled = item.DocStatus === "IN TRANSIT" ? "disabled" : "";

          rows.push([
            `<input type="checkbox" name="checkbox" data-row-batch="${item.BatchNumber}" data-docstatus="${item.DocStatus}"
            class="form-check-input align-self-center mx-auto checkbox border border-primary" style="cursor: pointer;" ${isDisabled}>`,
            index++,
            item.BatchNumber, // batch
            item.DocStatus,
            item.DocDate,
            (() => {
              let status = item.DocStatus || "";

              let badgeClass = "primary";

              if (status === "IN TRANSIT") badgeClass = "warning";
              else if (status === "DELIVERED") badgeClass = "success";

              return `<span class="badge bg-${badgeClass}">${status}</span>`;
            })(),
            '<div class="dropdown dropstart">' +
              '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown">' +
              '<i class="bi bi-three-dots"></i></button>' +
              `<ul class="dropdown-menu">
              <li><a class="dropdown-item open-picklist" href="#">Open</a></li>
              <li><a class="dropdown-item" href="#" data-batch="${item.BatchNumber}">Open</a></li>
              <li><a class="dropdown-item" href="#" data-batch="${item.BatchNumber}">Create DR</a></li>
            </ul>` +
              "</div>",
          ]);
        });

        if (rows.length === 0) {
          for (let i = 0; i < 8; i++) {
            rows.push(["", "", "", "", "", ""]);
          }
        }

        if ($.fn.DataTable.isDataTable("#loadingBasketTableDisplay")) {
          $("#loadingBasketTableDisplay").DataTable().clear().destroy();
        }

        $("#loadingBasketTableDisplay").Datatable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "#" },
            { title: "Batch No.", className: "text-start ps-5" },
            { title: "Status", className: "ps-3" },
            { title: "Date" },
            { title: "Action" },
          ],
          createdRow: function (row, data, dataIndex) {
            let originalItem = data[dataIndex];
            if (originalItem) {
              $(row).attr("data-batch", originalItem.PKList_Number);
            }
          },
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          order: [[0, "desc"]],
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });
            // $("td:eq(1)", row).addClass("text-primary ps-2");

            $(row).hover(
              function () {
                $(this).css("background", "#FFF4C2");
              },
              function () {
                $(this).css("background", "#FFFBDF");
              },
            );
          },
          drawCallback: function () {
            let tableBody = $("#loadingBasketTableDisplay tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                  <tr class="empty-row">
                    <td>&nbsp;</td>
                    <td colspan="5" style="background: #FFFBDF">&nbsp;</td>
                  </tr>
                `);

              $emptyRow.css({
                background: "#FFFBDF",
                height: "40px",
                "min-height:": "40px",
              });
              $emptyRow.hover(
                function () {
                  $(this).css("background", "#FFF4C2");
                },
                function () {
                  $(this).css("background", "#FFFBDF");
                },
              );
              tableBody.append($emptyRow);
            }

            const selectionMode =
              $("#loadingBasketTableDisplay").data("selectionMode") || false;
            $("#loadingBasketTableDisplay tbody tr").each(function () {
              const dropdownBtn = $(this).find(
                "button[data-bs-toggle='dropdown']",
              );

              if (selectionMode) {
                dropdownBtn.prop("disabled", true).addClass("disabled");
              } else {
                dropdownBtn.prop("disabled", false).removeClass("disabled");
              }
            });
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading basket data: ", error);
    },
  });
}
