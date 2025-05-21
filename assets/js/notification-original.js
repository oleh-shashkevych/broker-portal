function removeNotificationItmTopBar(nid, byid, pathsend) {
    let notif_errbl = $('.notif_remove_ress');
    let btn_dngr = $('.btn.notification_itm_ico span');
    let modal_body = $('.modal_body_pos_centr');

    if (!notif_errbl.length || !btn_dngr.length || !modal_body.length) {
        console.warn("Required elements not found in removeNotificationItmTopBar");
        return;
    }

    notif_errbl.fadeOut("fast");

    if (nid && byid && pathsend) {
        $.ajax({
            url: pathsend,
            method: 'get',
            dataType: 'json',
            success: function (data) {
                if (data && data.status === true) {
                    notif_errbl.html("<p class='notif_st_tru'>Removed successfully</p>");
                    notif_errbl.fadeIn("fast");

                    let targetElement = $("#" + byid);
                    if (targetElement.length) {
                        targetElement.hide();
                    } else {
                        console.warn(`Element with ID ${byid} not found`);
                    }

                    if (data.count === 0) {
                        btn_dngr.removeClass("notification_linck_itm_ico_dngr").addClass("notification_linck_itm_ico_none");
                        modal_body.html("<div class='notif_none'>There are no messages.</div>");
                    }
                } else if (data && data.status === false) {
                    let message = data.msg || "An unknown error occurred";
                    notif_errbl.html("<p class='notif_st_false'>" + message + "</p>");
                    notif_errbl.fadeIn("fast");
                } else {
                    console.warn("Invalid response structure:", data);
                }
            },
            error: function (jqXHR, exception) {
                let sherr;
                switch (jqXHR.status) {
                    case 0:
                        sherr = 'Not connected. Verify Network.';
                        break;
                    case 404:
                        sherr = 'Requested page not found (404).';
                        break;
                    case 500:
                        sherr = 'Internal Server Error (500).';
                        break;
                    default:
                        if (exception === 'parsererror') {
                            sherr = 'Requested JSON parse failed.';
                        } else if (exception === 'timeout') {
                            sherr = 'Time out error.';
                        } else if (exception === 'abort') {
                            sherr = 'Ajax request aborted.';
                        } else {
                            sherr = 'Uncaught Error. ' + (jqXHR.responseText || "No response text");
                        }
                        break;
                }

                if (sherr) {
                    notif_errbl.html("<p class='notif_st_false'>" + sherr + "</p>");
                    notif_errbl.fadeIn("fast");
                }
            }
        });
    } else {
        console.warn("Missing required arguments: nid, byid, or pathsend");
    }
}