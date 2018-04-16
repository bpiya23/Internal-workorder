$(function() {

    $("#helpContent").keydown(function() {
        limitText(this, 1000, $("#countdown"));
    });

    $("#helpContent").keyup(function() {
        limitText(this, 1000, $("#countdown"));
    });

    var name = $("#helpFromName"),
        email = $("#helpEmail"),
        subject = $("#helpSubject"),
        content = $("#helpContent"),
        allFields = $([]).add(name).add(email).add(subject).add(content),
        helpTips = $(".validateTips");

    function updateTips(t) {
        helpTips.text(t)
            .addClass("ui-state-highlight");
        setTimeout(function() {
            helpTips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    $("#helpForm").dialog({
        autoOpen: false,
        height: 525,
        width: 500,
        modal: true,
        buttons: {
            "Submit": function() {
                var bValid = true;
                allFields.removeClass("ui-state-error");

                bValid = bValid && checkLength(name, "name", 3, 30);
                bValid = bValid && checkLength(email, "email", 1, 80);
                bValid = bValid && checkLength(content, "content", 1, 1000);

                // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. first.last@capitalone.com");


                if (bValid) {
                    sendHelpEmail();
                    $(this).dialog("close");
                }
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        open: function() {
            $("#helpFromName").val($("#sessionUserName").val());
            $("#helpEmail").val($("#sessionUserEmail").val());
        },
        close: function() {
            allFields.val("").removeClass("ui-state-error");
            $("#countdown").val("1000");
            $('#helpSubject option:first').prop("selected", true);
        }
    });

    $(".btnHelp")
        .click(function() {
            $("#helpForm").dialog("open");
        });
});

// function to save the form
function sendHelpEmail() {
    $.ajax({
        url: "emailHelp.ajax.do",
        type: 'post',
        processData: false,
        data: JSON.stringify($("#helpForm").serializeObject()),
        contentType: 'application/json',
        success: function(data) {
            alert("Your question/feedback has been sent!");

        },
        error: function(xhr, textStatus, thrownError) {
            alert("Your question/feedback has been sent!");
        }
    });
}

//only form elements with name attribute will be serialized
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//TODO: Put this in eup namespace
//LimitCount is an optional parameter, use if you have a countdown field
function limitText(limitField, limitNum, limitCount) {
    if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
    } else {
        if (limitCount !== undefined) {
            $(limitCount).val(limitNum - limitField.value.length);
        }

    }

}