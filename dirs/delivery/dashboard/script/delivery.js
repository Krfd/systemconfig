$(document).ready(function () {
  loadDashboard();
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

function loadDashboard() {
  $.post("dirs/delivery/dashboard/components/main.php", {}, function (data) {
    $("#delivery_content").html(data);
  });
  loadDelivery();
}

function openForm() {
  $.post("dirs/delivery/dashboard/form.php", {}, function (data) {
    $("#main-content").html(data);
    loadDelivery();
    $("#deliveryTableDisplay").DataTable({
      pageLength: 50,
      order: [0, "desc"],
    });
  });
}

function loadDelivery() {
  $.ajax({
    url: "dirs/incoming/dashboard/actions/get_incoming.php",
    type: "POST",
    dataType: "json",
    success: function (response) {
      let rows = [];
      let existingSeries = new Set();
      if (response.isSuccess === "success") {
        let sortedData = response.Data.sort(
          (a, b) => Number(b.SeriesNum || 0) - Number(a.SeriesNum || 0),
        );

        sortedData.forEach((item) => {
          let status = item.RequestStatus
            ? item.RequestStatus.toUpperCase()
            : "";
          let statusClass = "";

          if (status === "NEW") {
            statusClass = "bg-primary";
          } else if (status === "CANCEL" || status === "CANCELLED") {
            statusClass = "bg-warning";
          } else if (status === "TERMINATED") {
            statusClass = "bg-secondary";
          } else if (status === "REJECTED") {
            statusClass = "bg-danger";
          } else if (status === "PROCESSING") {
            statusClass = "bg-info";
          }

          let statusBadge = `<span class="badge ${statusClass}">${status || ""}</span>`;

          if (existingSeries.has(item.SeriesNum)) {
            return;
          }

          existingSeries.add(item.SeriesNum);

          rows.push([
            item.SeriesNum || "",
            item.SRN || "DR-10001",
            item.Branch || "",
            item.PicklistNumber || "",
            statusBadge,
            item.RequestStatus || "",
            item.DocDate || "",
          ]);
        });

        if ($.fn.DataTable.isDataTable("#deliveryTableDisplay")) {
          $("#deliveryTableDisplay").DataTable().clear().destroy();
          $("#deliveryTableDisplay tbody").empty();
        }

        $("#deliveryTableDisplay").DataTable({
          data: rows,
          columns: [
            { title: "", className: "text-center" },
            { title: "#" },
            { title: "SRN" },
            { title: "Type of Request" },
            { title: "Requesting Branch" },
            { title: "Status" },
            { title: "Date" },
            { title: "Picklist No." },
          ],
          pageLength: 50,
          paging: true,
          searching: true,
          info: true,
          processing: false,
          autoWidth: false,
          language: {
            emptyTable: "", // 🔥 removes "No data available in table"
          },
          rowCallback: function (row, data) {
            $("td:not(:first-child)", row).css({
              background: "#FFFBDF",
              padding: "3px",
              height: "40px",
              "min-height": "40px",
              cursor: "pointer",
            });

            $("td:eq(1)", row).addClass("text-center");
            $("td:eq(2)", row).addClass("text-primary");
            $("td:eq(6)", row).addClass("text-start");

            // Hover effect
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
            let tableBody = $("#deliveryTableDisplay tbody");
            let currentRows = tableBody.find("tr").length;

            for (let i = currentRows; i < 8; i++) {
              let $emptyRow = $(`
                <tr class="empty-row">
                  <td></td>
                  <td colspan="7" style="background:#FFFBDF"></td>
                </tr>
              `);

              $($emptyRow).css({
                background: "#FFFBDF",
                height: "40px",
                cursor: "pointer",
              });

              $emptyRow.hover(
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFF4C2");
                },
                function () {
                  $("td:not(:first-child)", this).css("background", "#FFFBDF");
                },
              );

              tableBody.append($emptyRow);
            }
          },
        });
      } else {
        console.error(response.Data);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error loading incoming data: ", error);
    },
  });
}

// DELIVERY BASKET
function loadDeliveryBasket() {
  $.post("dirs/delivery/dashboard/loadDeliveryBasket.php", {}, function (data) {
    $("#delivery-content").html(data);

    $.fn.dataTable.ext.order["ignoreEmpty"] = function (settings, col) {
      return this.api()
        .column(col, { order: "index" })
        .nodes()
        .map(function (td) {
          if ($(td).text().trim() === "") return Infinity;
          return $(td).text();
        });
    };

    $.ajax({
      // url: "dirs/delivery/dashboard/actions/deliveryBasketItems.php",
      url: "dirs/incoming/dashboard/actions/picklisteditems.php",
      type: "POST",
      dataType: "json",
      success: function (response) {
        if (
          !response ||
          response.isSuccess !== "success" ||
          !Array.isArray(response.Data)
        ) {
          response = {
            isSuccess: "success",
            Data: [],
          };
        }
        let rows = [];
        if (response.isSuccess === "success") {
          let sortedData = response.Data.sort(
            (a, b) => Number(b.BaseNum_SRN || 0) - Number(a.RowNum || 0),
          );

          sortedData.forEach((item) => {
            rows.push([
              item.PickLst_Num || "",
              item.DocDate || "",
              item.PickedQty || "",
              '<div class="dropdown dropstart">' +
                '<button class="btn btn-sm" type="button" data-bs-toggle="dropdown"> ' +
                '<i class="bi bi-three-dots"></i></button>' +
                `<ul class="dropdown-menu">
                  <li><a class="dropdown-item open-picklist" href="#">Open</a></li>
                  <li>
                      <a class="dropdown-item print-picklist" 
                        href="#"
                        data-picklist="${item.PickLst_Num}">
                        Print
                      </a>
                    </li>
                </ul>
              </div>`,
            ]);
          });

          if (rows.length === 0) {
            for (let i = 0; i < 8; i++) {
              rows.push(["", "", "", ""]);
            }
          }

          if ($.fn.DataTable.isDataTable("#deliveryBasketTable")) {
            $("#deliveryBasketTable").DataTable().clear().destroy();
          }

          $("#deliveryBasketTable").DataTable({
            data: rows,
            columns: [
              { title: "Picklist No.", className: "text-center open-picklist" },
              { title: "Date", className: "text-start" },
              { title: "Quantity", className: "text-center" },
              { title: "", orderable: false },
            ],
            createdRow: function (row, data, dataIndex) {
              let originalItem = sortedData[dataIndex];

              if (originalItem) {
                $(row)
                  .attr("data-rownum", originalItem.RowNum)
                  .attr("data-picklist-num", originalItem.PickLst_Num)
                  .addClass("picklist-row");
              }
            },
            paging: true,
            searching: true,
            info: true,
            processing: false,
            autoWidth: false,
            order: [[0, "desc"]],
            rowCallback: function (row, data) {
              $("td", row).css({
                background: "#FFFBDF",
                padding: "3px",
                height: "40px",
                "min-height": "40px",
                cursor: "pointer",
              });
              $("td:eq(0)", row).addClass("text-primary");
              $("td:eq(1)", row).css("text-align", "start");

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
              let tableBody = $("#deliveryBasketTable tbody");
              let currentRows = tableBody.find("tr").length;

              for (let i = currentRows; i < 8; i++) {
                let $emptyRow = $(`
                <tr class="empty-row" style="background: #FFFBDF">
                  <td colspan="4" style="background: #FFFBDF">&nbsp;</td>
                </tr>
              `);
                $emptyRow.css({
                  background: "#FFFBDF",
                  height: "40px",
                  "min-height": "40px",
                  cursor: "pointer",
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

              // $("#deliveryBasketTable").on(
              //   "click",
              //   ".print-picklist",
              //   function (e) {
              //     e.preventDefault();
              //     e.stopPropagation(); // prevent dropdown or row click from interfering

              //     const srn = $(this).data("srn");
              //     const PKlistNum = $(this).data("picklist");

              //     Swal.fire({
              //       title: "Print this Picklist?",
              //       icon: "question",
              //       showCancelButton: true,
              //       confirmButtonText: "Print",
              //       confirmButtonColor: "#0d6efd",
              //       cancelButtonText: "Cancel",
              //     }).then((result) => {
              //       if (result.isConfirmed) {
              //         $.post(
              //           "dirs/incoming/dashboard/actions/save_print_delivery.php",
              //           { PKlistNum: PKlistNum },
              //           function () {
              //             window.open(
              //               `pdf/requests.php?srn=${srn}&picklist=${PKlistNum}`,
              //               "_blank",
              //             );
              //           },
              //         );
              //       }
              //     });
              //   },
              // );
            },
          });
        } else {
          console.error(response.Data);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error loading outgoing data: ", error);
      },
    });
  });
}
// function openDR1() {
//   $.post("dirs/delivery/dashboard/delivery1.php", {}, function (data) {
//     $("#main-content").html(data);
//   });
// }

// LOADING BASKET
function loadReturn() {
  $.post("dirs/delivery/dashboard/delivery.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

function picklistItem1() {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// LOADING ITEMS
function loadDeliveryItems() {
  $.post("dirs/delivery/dashboard/loadDeliveryItems.php", {}, function (data) {
    $("#main-content").html(data);
  });
}

// DELIVERY FORM
function loadDeliveryForm() {
  $.post("dirs/delivery/dashboard/deliveryForm.php", {}, function (data) {
    $("#delivery_content").html(data);
  });
}
