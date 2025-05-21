$(document).ready(function(){
    $('.basic-multiple').select2(
        {
            selectAll: false,
            width: "100%",
            placeholder: "Choose...",
            closeOnSelect: false,
            minimumResultsForSearch: -1
        }
    );

    $('.basic-single').select2(
        {
            selectAll: false,
            width: "100%",
            placeholder: "Please Select...",
            minimumResultsForSearch: -1,
            templateResult: function (data, container) {
                if (data.element) {
                  $(container).addClass("single-select-option");
                }
                return data.text;
              }
        }
    );

    $('.phone-number').keydown(function (e) {
		const key = e.which || e.charCode || e.keyCode || 0;
		$phone = $(this);

    // Don't let them remove the starting '('
    if ($phone.val().length === 1 && (key === 8 || key === 46)) {
			$phone.val('('); 
      return false;
		} 
    // Reset if they highlight and type over first char.
    else if ($phone.val().charAt(0) !== '(') {
			$phone.val('('+String.fromCharCode(e.keyCode)+''); 
		}

		// Auto-format- do not expose the mask as the user begins to type
		if (key !== 8 && key !== 9) {
			if ($phone.val().length === 4) {
				$phone.val($phone.val() + ')');
			}
			if ($phone.val().length === 5) {
				$phone.val($phone.val() + ' ');
			}			
			if ($phone.val().length === 9) {
				$phone.val($phone.val() + '-');
			}
		}

		// Allow numeric (and tab, backspace, delete) keys only
		return (key == 8 || 
				key == 9 ||
				key == 46 ||
				(key >= 48 && key <= 57) ||
				(key >= 96 && key <= 105));	
	})
	
	.bind('focus click', function () {
		$phone = $(this);
		
		if ($phone.val().length === 0) {
			$phone.val('(');
		}
		else {
			$phone.val('').val($phone.val()); // Ensure cursor remains at the end
		}
	})
	
	.blur(function () {
		$phone = $(this);
		
		if ($phone.val() === '(') {
			$phone.val('');
		}
	});

    $.ajaxSetup({
        headers: {
            api_key: "9ecda589c54766ee3f4a84886ebf2f2e",
        },
    });
    
    $("#fileuploader").uploadFile({
        url:"https://api.imghippo.com/v1/upload",
        dragdropWidth: "100%",
        showDelete: true,
        // showFileSize: false,
        customProgressBar: function(obj,s)
        {
            $(".ajax-file-upload-container").text("");
            console.log("obj,s", obj,s);
            count = 0;
            this.statusbar = $("<div class='ajax-file-upload-statusbar'></div>");
            this.filename = $("<div class='ajax-file-upload-filename'></div>").appendTo(this.statusbar);

            console.log("sdsd", obj);
            console.log("sdsd", s);
            console.log("sdsd", obj.existingFileNames);
          

            const data = obj.existingFileNames[obj.existingFileNames.length - 1].split(" ");


            $("<div class='name'>"+ data[0] +"</div>").appendTo(this.statusbar);
            $("<div class='size'>"+ data[1] +"</div>").appendTo(this.statusbar);
            this.progressDiv = $("<div class='ajax-file-upload-progress'>").appendTo(this.statusbar).hide();
            this.progressbar = $("<div class='ajax-file-upload-bar'></div>").appendTo(this.progressDiv);
            this.abort = $("<div>" + s.abortStr + "</div>").appendTo(this.statusbar).hide();
            this.cancel = $("<div>" + s.cancelStr + "</div>").appendTo(this.statusbar).hide();
            this.done = $("<div>" + s.doneStr + "</div>").appendTo(this.statusbar).hide();
            this.download = $("<div>" + s.downloadStr + "</div>").appendTo(this.statusbar).hide();
            this.del = $("<div>" + s.deleteStr + "</div>").appendTo(this.statusbar).hide();

            this.abort.addClass("ajax-file-upload-red");
            this.done.addClass("ajax-file-upload-green");
            this.download.addClass("ajax-file-upload-green");        
            this.cancel.addClass("ajax-file-upload-red");
            this.del.addClass("ajax-file-upload-red");
            return this;
        }
    });
});