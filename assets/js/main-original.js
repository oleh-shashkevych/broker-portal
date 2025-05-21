$(document).ready(function() {
    try {
        // Initialize tab functionality
        tabFunc();

        const links = $('.left_cp_bar li a');
        if (!links.length) {
            
            return;
        }

        const url = window.location.pathname;
        const hrefurl = window.location.href;
        const parsepathurlsl = url.split('/');
        const urlRegExp = new RegExp(url.replace(/\/$/,'') + "$");
        const parsurlget = getUrlParameter("mp");

        // Active link handling
        links.each(function() {
            try {
                const curparslinc = this.href.split('/');
                const curparsgetprm = this.href.split('?');
                const curpathurl = this.href.replace(/\/$/,'');

                if (!curparslinc || !curparsgetprm || !curpathurl) {
                    return true; // Continue to next iteration
                }

                if (urlRegExp.test(curpathurl) && curparsgetprm[1] === "mp=35") {
                    $(this).addClass('active');
                    return false;
                } else if (parsurlget === "35" && curparsgetprm[1] === "mp=35") {
                    $(this).addClass('active');
                    return false;
                } else if (parsepathurlsl[1] === curparslinc[3] && curparslinc[4] && curparslinc[3] !== "ap") {
                    if (curparsgetprm[1] !== "mp=35" && parsurlget !== "35") {
                        $(this).addClass('active');
                        return false;
                    }
                } else if (hrefurl === curpathurl && curparsgetprm[1] !== "mp=35") {
                    $(this).addClass('active');
                    return false;
                }
            } catch (err) {
                console.error('Error processing link:', err);
            }
        });

        // Form submission handling
        $('button[type="submit"]').keydown(function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        });

        // File download handling
        $(document).on('click', '#lender_download_all_files', function() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const lender_id = urlParams.get('id');
                
                if (!lender_id) {
                    
                    return;
                }

                window.location.href = `/ap/settings/lender/download-all-lender-files?id=${lender_id}`;
            } catch (error) {
                console.error('Error handling file download:', error);
            }
        });

        // Input mask initialization
        try {
            // Phone masks
            $(document).on('focus', '.phone-us', function() {
                $(this).inputmask("999-999-9999");
            });

            $(document).on('focus', '.input_phone', function() {
                $(this).inputmask("(999) 999-9999");
            });

            // Currency format
            $('.opportunity_format_currency').inputmask({
                alias: 'currency',
                prefix: '$',
                rightAlign: false,
                max: 9999999999.99
            });

            // Other formats
            $('.opportunity_format_email').inputmask({ alias: 'email' });
            $('.opportunity_format_phone').inputmask("(999) 999-9999");
            $('.opportunity_format_tax').inputmask("99-9999999");
            
            // Number format
            $('.opportunity_format_number').inputmask({
                alias: 'numeric',
                allowMinus: false,
                digits: 0,
                rightAlign: false
            });

            // Decimal format
            $('.opportunity_format_decimal').inputmask({
                alias: 'decimal',
                allowMinus: false,
                digits: 2,
                digitsOptional: false,
                shortcuts: null,
                rightAlign: false,
                max: 9999999999.99
            });
        } catch (error) {
            console.error('Error initializing input masks:', error);
        }

        // URL format handling
        $(document).on('focus keyup', '.opportunity_format_url', function() {
            try {
                if (this.value.indexOf('https://') !== 0) {
                    this.value = this.value.length <= 8 ? 'https://' : 'https://' + this.value;
                }
            } catch (error) {
                console.error('Error formatting URL:', error);
            }
        });

        $('.opportunity_format_url').on('blur', function() {
            try {
                if (this.value === 'https://') {
                    this.value = '';
                }
            } catch (error) {
                console.error('Error handling URL blur:', error);
            }
        });

        // Checkbox handling
        $('#select-all-input').click(function() {
            try {
                const checkboxes = $('.table_list_inp_select');
                if (!checkboxes.length) {
                    
                    return;
                }

                const checkedStatus = this.checked;
                checkboxes.each(function() {
                    this.checked = checkedStatus;
                });

                checkedStatus ? deleteButtonShowTrue() : deleteButtonShowFalse();
            } catch (error) {
                console.error('Error handling select all:', error);
            }
        });

        $('.table_list_inp_select').click(function() {
            try {
                arrInputAllListPage();
            } catch (error) {
                console.error('Error handling checkbox click:', error);
            }
        });

        // Field alias handling
        $(document).on('keyup', '#opportunity_edit_template_field_aliace', function() {
            try {
                const value = $(this).val();
                if (typeof value === 'string') {
                    $(this).val(value.replace(/[\s_\-]+/g, "_"));
                }
            } catch (error) {
                console.error('Error handling field alias:', error);
            }
        });

    } catch (error) {
        console.error('Error in document ready handler:', error);
    }
});

function commNoteparsUrlToLink(iditm) {
    if (!iditm) {
        iditm = "#laoq-comments-con-note";
    }

    const el = $('' + iditm + ' .laoq_comment_text_val');
    if (el && el.length > 0) {
        el.html(function (i, text) {
            return text.replace(
                /\s(http(s)?:\/\/[^\s]+)\s/g,
                '<a href="$&" target="_blank" title="Open New Tab" rel="noreferrer nofollow">$&</a>'
            );
        });
    } else {
        
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    try {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    } catch (error) {
        console.error('Error in getUrlParameter:', error);
    }
    return false;
};

function tabFunc() {
    let gettaburl = getUrlParameter("tabopen");
    if (gettaburl && gettaburl.length > 0) {
        if (gettaburl === "note") {
            let getNoteIdurl = getUrlParameter("tabnote");
            let bltab = $('#laoq-comments-con');
            if (bltab && bltab.length > 0) {
                bltab.addClass('laoq_comments_con_active');
                bltab.fadeIn();
                if (getNoteIdurl && getNoteIdurl.length > 0) {
                    const targetElem = $('#comm-note-' + getNoteIdurl);
                    if (targetElem && targetElem.length > 0) {
                        $('#laoq-comments-con .laoq_comments_con_main').animate({
                            scrollTop: targetElem.offset().top - 140
                        }, 700);
                        targetElem.addClass('comnoteFocus');
                    } else {
                        
                    }
                }
            } else {
                
            }
        }
    }
}

function replaceQueryParam(param, newval, search) {
    if (!param || !search) {
        
        return search;
    }
    try {
        var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
        var query = search.replace(regex, "$1").replace(/&$/, '');
        return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
    } catch (error) {
        console.error('Error in replaceQueryParam:', error);
        return search;
    }
}

function arrInputAllListPage() {
    var ststusch = false;
    $('.table_list_inp_select').each(function (index) {
        if ($(this).is(':checked')) {
            ststusch = true;
        }
    });

    if (ststusch) {
        deleteButtonShowTrue();
    } else {
        deleteButtonShowFalse();
        if ($('#select-all-input').length > 0 && $('#select-all-input').is(':checked')) {
            $('#select-all-input').prop("checked", false);
        }
    }
}

function deleteButtonShowTrue() {
    const delButton = $('#delete-button-list');
    if (delButton && delButton.length > 0) {
        delButton.show();
    } else {
        
    }
}

function deleteButtonShowFalse() {
    const delButton = $('#delete-button-list');
    if (delButton && delButton.length > 0) {
        delButton.hide();
    } else {
        
    }
}

function clickRandomPasswordGeneratorButton() {
    if ($.passGen) {
        let randomPassword = $.passGen({
            'length': 10,
            'numeric': true,
            'lowercase': true,
            'uppercase': true,
            'special': true
        });
        $(".random-password-field").val(randomPassword);
        $(".random-password-confirm-field").val(randomPassword);
        $("#copy-random-password-button").removeClass("d-none");
    } else {
        console.error('$.passGen is not defined');
    }
}

function clickCopyRandomPasswordButton() {
    const passwordField = $('.random-password-field');
    if (passwordField && passwordField.length > 0) {
        switch (passwordField.prop('type')) {
            case 'password':
                $('input:password.random-password-field').prop('type', 'text');
                passwordField.focus().select();
                $('input:text.random-password-field').prop('type', 'password');
                break;
            case 'text':
                passwordField.focus().select();
                break;
            default:
                
                break;
        }
    } else {
        
    }
}

function clickShowOrHidePasswordIcon(element) {
	if (!element || !$(element).length) {
		
		return;
	}
	if ($(element).hasClass("fa-eye")) {
		$(element).removeClass("fa-eye").addClass("fa-eye-slash");
		$(element).next().prop('type', 'text');
	} else {
		$(element).removeClass("fa-eye-slash").addClass("fa-eye");
		$(element).next().prop('type', 'password');
	}
}

function clickShowSplr(element, button) {
	if (!element || !button || !$(element).length || !$(button).length) {
		
		return;
	}
	if ($(element).hasClass("fade-active")) {
		$(button).fadeIn('50');
		$(element).hide().removeClass("fade-active");
	} else {
		$(button).hide();
		$(element).fadeIn('50').addClass("fade-active");
	}
}

// Edit value field by ID
function editValueFieldId(id) {
	if (!id || $("#" + id).length === 0) {
		
		return;
	}
	if ($("#" + id).css('display') === 'none') {
		$("#" + id).show().focus();
		$("#field-" + id).hide();
	}
}

function addAnotherOpportunityDropdownOption() {
	const template = $('#template_opportunity_dropdown_option');
	const container = $("#add_another_opportunity_dropdown_options");
	if (!template.length || !container.length) {
		
		return;
	}
	template.children('.add_another_opportunity_dropdown_option')
		.clone()
		.appendTo(container)
		.prop('hidden', false)
		.removeClass('hidden')
		.find(".disabled").prop('disabled', false).removeClass('disabled').val("");

	showOrHideRemoveBtnOpprtunityTemplateDropdownOption();
}

function removeOpportunityDropdownOption(option) {
	const parent = $(option).closest('.add_another_opportunity_dropdown_option');
	if (!parent.length) {
		
		return;
	}
	parent.remove();
	showOrHideRemoveBtnOpprtunityTemplateDropdownOption();
}

function addAnotherRepLender() {
	const template = $('#add_another_rep_lender_rows').children('.add-another-rep-lender').first();
	if (!template.length) {
		
		return;
	}
	template.clone()
		.appendTo("#add_another_rep_lender_rows")
		.find("input[type='text']").val("");

	showOrHideRemoveBtnRepLender();
}

function addAdditionalRepLender() {
	const template = $('#add_another_rep_lender_rows').children('.add-another-rep-lender').first();
	if (!template.length) {
		
		return;
	}
	template.clone()
		.appendTo("#add_another_rep_lender_rows")
		.find(".hidden").prop('hidden', false).removeClass('hidden')
		.find(".disabled").prop('disabled', false).removeClass('disabled');

	showOrHideRemoveBtnRepLender();
}

function removeRepLender(rep) {
	const parent = $(rep).closest('.add-another-rep-lender');
	if (!parent.length) {
		
		return;
	}
	parent.remove();
	showOrHideRemoveBtnRepLender();
}

function postRemoveRepLender(rep, token_name) {
	if (!rep || !token_name || token_name.length < 3) {
		
		return false;
	}

	const removed = confirm("Delete this rep ?");
	if (!removed) {
		return false;
	}

	let token_code = $("input[name=" + token_name + "]").val();
	if (!token_code || token_code.length < 32) {
		
		return false;
	}

	let lender_id = 0;
	const searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has('id')) {
		lender_id = searchParams.get('id');
	}
	if (lender_id == 0) {
		
		return false;
	}

	let rep_id = $(rep).closest('.add-another-rep-lender').find(".lender_rep_id").val();
	if (!rep_id || rep_id < 1) {
		
		return false;
	}

	let request = {
		[token_name]: token_code,
		lender_id: lender_id,
		rep_id: rep_id
	};

	$.ajax({
		url: '/ap/settings/lender/delete-rep',
		method: 'post',
		data: request,
		dataType: 'json',
		success: function (response) {
			if (response.new_token_code) {
				$("input[name=" + token_name + "]").val(response.new_token_code);
			}
			if (response.deleted === true) {
				removeRepLender(rep);
			}
		},
		error: function (response) {
			console.error("Error in postRemoveRepLender:", response);
		}
	});
}

function currentRepCountForNewLender() {
	try {
		return $('.remove-rep-lender-btn').length;
	} catch (error) {
		console.error("Error in currentRepCountForNewLender:", error);
		return 0;
	}
}

function currentOpportunityTemplateDropdownOptionCount() {
	try {
		return $('.opportunity-templte-dropdown-remove-option-btn').length;
	} catch (error) {
		console.error("Error in currentOpportunityTemplateDropdownOptionCount:", error);
		return 0;
	}
}

function showOrHideRemoveBtnOpprtunityTemplateDropdownOption() {
	try {
		if (currentOpportunityTemplateDropdownOptionCount() > 1) {
			$('.opportunity-templte-dropdown-remove-option-btn').removeClass('d-none');
		} else {
			$('.opportunity-templte-dropdown-remove-option-btn').addClass('d-none');
		}
	} catch (error) {
		console.error("Error in showOrHideRemoveBtnOpprtunityTemplateDropdownOption:", error);
	}
}

function showOrHideRemoveBtnRepLender() {
	try {
		if (currentRepCountForNewLender() > 1) {
			$('.remove-rep-lender-btn').removeClass('d-none');
		} else {
			$('.remove-rep-lender-btn').addClass('d-none');
		}
	} catch (error) {
		console.error("Error in showOrHideRemoveBtnRepLender:", error);
	}
}

function lenderEditFileName(element) {
	try {
		let parent = $(element).parent();
		if (!parent.length) {
			
			return;
		}
		parent.hide();
		let editable_input = parent.next().find('input');
		if (editable_input.length) {
			editable_input.attr('size', editable_input.val().length);
			parent.next().show();
			editable_input.select();
		} else {
			
		}
	} catch (error) {
		console.error("Error in lenderEditFileName:", error);
	}
}

function lenderRenameFile(element, file_id) {
	try {
		let parent = $(element).parent();
		let old_file_name = parent.prev().find('a').html();
		if (!old_file_name) {
			
			return;
		}
		let ext = old_file_name.split(".").pop().toLowerCase();
		let new_file_name_without_ext = parent.find('input').val().trim().replace(/\s+/gi, "_");
		parent.find('input').val(new_file_name_without_ext);

		let filename_pattern = /^[a-zA-Z0-9_.()-]+$/;
		if (!filename_pattern.test(new_file_name_without_ext)) {
			alert(`"${new_file_name_without_ext}" filename is invalid.`);
			return;
		}
		let new_file_name = `${new_file_name_without_ext}.${ext}`;

		if (new_file_name !== old_file_name) {
			let token_name = $(element).closest('form').children('input').first().attr('name');
			if (!token_name || token_name.length < 3) {
				
				return false;
			}
			let token_code = $(`input[name=${token_name}]`).val();
			if (!token_code || token_code.length < 32) {
				
				return false;
			}
			let lender_id = 0;
			let searchParams = new URLSearchParams(window.location.search);
			if (searchParams.has('id')) {
				lender_id = searchParams.get('id');
			}
			if (lender_id === 0) {
				
				return false;
			}

			let request = {
				[token_name]: token_code,
				file_id: file_id,
				new_file_name: new_file_name
			};
			$.ajax({
				url: `/ap/settings/lender/rename-lender-file?lender_id=${lender_id}`,
				method: 'post',
				data: request,
				dataType: 'json',
				success: function (response) {
					if (!response.renamed) {
						let errorMessage = response.error ? response.error.replace(/<\/?[^>]+(>|$)/g, "") : "Failed to rename file";
						alert(errorMessage);
					} else {
						parent.prev().find('a').html(new_file_name); // Update view
						parent.hide();
						parent.prev().show();
					}
					$(`input[name=${token_name}]`).val(response.new_token_code); // Update CSRF token
				},
				error: function (jqXHR) {
					let cleanText = jqXHR.responseText.replace(/<\/?[^>]+(>|$)/g, "");
					alert(cleanText);
				}
			});
		}
	} catch (error) {
		console.error("Error in lenderRenameFile:", error);
	}
}

function lenderCancelRenameFile(element) {
	try {
		let parent = $(element).parent();
		let old_file_name = parent.prev().find('a').html();
		if (!old_file_name) {
			
			return;
		}
		let old_file_name_without_ext = old_file_name.substring(0, old_file_name.lastIndexOf('.'));
		parent.find('input').val(old_file_name_without_ext);
		parent.hide();
		parent.prev().show();
	} catch (error) {
		console.error("Error in lenderCancelRenameFile:", error);
	}
}

function change_opportunity_field_type(element) {
	try {
		let footer = $(element).closest('.opportunity_select_field_type_header').next();
		if (!footer.length) {
			
			return;
		}
		if (element.value === '') {
			footer.find(".field-name-configuration").prop('hidden', true);
			footer.find(".dropdown-configuration").prop('hidden', true);
		} else {
			footer.find(".field-name-configuration").prop('hidden', false);
		}
		if (element.value === 'dropdown') {
			footer.find(".dropdown-configuration").prop('hidden', false);
		} else {
			footer.find(".dropdown-configuration").prop('hidden', true)
				.find("#add_another_opportunity_dropdown_options")
				.empty();
		}
	} catch (error) {
		console.error("Error in change_opportunity_field_type:", error);
	}
}

function toTitleCase(str) {
	try {
		return str.split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1).toLowerCase()).join(" ");
	} catch (error) {
		console.error("Error in toTitleCase:", error);
		return str;
	}
}