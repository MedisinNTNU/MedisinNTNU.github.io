/****** DIALOG-RELATED CODE ******/

/* default template used for rendering the dialog window */
const dialogTemplateHtml = '' +
    '<div class="dialog">' +
        '<div class="dialog-header"><h4 class="dialog-title"></h4><button class="close-dialog-btn">x</button></div>' +
        '<div class="dialog-content">' +
            '<p>test</p>' +
        '</div>' +
        '<div class="dialog-footer"></div>' +
    '</div>';

function hideDialog() {
	document.querySelector("body").classList.remove("dialog-visible");
	console.log("Attempted to hide dialog");
}

function showDialog(title, contentHtml, footerHtml, onRenderCallback) {
	/* 
		shows a dialog window.
		title: shows up in the title of the dialog.
		contentHtml: any html, shows up in the dialog body.
		footerHtml: any html, shows up in the footer. contains a close button by default.
		onRenderCallback: function, runs after the dialog is finished rendering. useful for adding buttons.
	*/

    var body = document.querySelector("body");

	/* create dialog container if it doesn't exist */
    if (!document.querySelector(".dialog-backdrop")) {
        var dialogContainer = document.createElement("div");
		dialogContainer.className = "dialog-backdrop";
		dialogContainer.innerHTML = dialogTemplateHtml;
		body.appendChild(dialogContainer);   
	}
	
	var dialog = document.querySelector(".dialog");
	
	/* check if we already have an open dialog */
    if (body.classList.contains("dialog-visible") && !dialog.classList.contains("dialog-hidden")) {
        /* hide current dialog, open new one after a delay to give it time to close */
        dialog.classList.add("dialog-hidden");
        setTimeout(function(){ showDialog(title, contentHtml, footerHtml, onRenderCallback); }, 500);
        return;
    }
	
	var dialogContainer = document.querySelector(".dialog-backdrop");
	
	/* set up dialog contents */
	var outputTitle = 'Dialog';
	var outputContentHtml = '<p>No content specified</p>';
	var outputFooterHtml = '<button class="close-dialog-btn">Close</button>';
	
	if (title && title.length > 0) {
		outputTitle = title;
	}
	
	if (contentHtml && contentHtml.length > 0) {
		outputContentHtml = contentHtml;
	}
	
	if (footerHtml && title.length > 0) {
		outputFooterHtml = footerHtml;
	}
	
	dialog.querySelector(".dialog-title").innerHTML = outputTitle;
	dialog.querySelector(".dialog-content").innerHTML = outputContentHtml;
	dialog.querySelector(".dialog-footer").innerHTML = outputFooterHtml;
	
	/* bind button event listeners */
    var closeButtons = dialog.getElementsByClassName("close-dialog-btn");
	
	for (var i = 0; i < closeButtons.length; i++) {
		 closeButtons[i].addEventListener('click', hideDialog);
    }
	
	dialogContainer.addEventListener('click', hideDialog);
	dialog.addEventListener('click', function(e){e.stopPropagation();});
	
	/* run callback function if set */
	if (onRenderCallback) {
		onRenderCallback();
	}
	
	/* show dialog */
    body.classList.add("dialog-visible");
	dialog.classList.remove("dialog-hidden");
	console.log("Attempted to show dialog with title " + outputTitle);
}

/****** CODE TO RUN ON PAGE LOAD ******/

renderFileToContainer("shared-html/header.html", "header", renderFinishedCallback);

renderFileToContainer("shared-html/footer.html", "footer", renderFinishedCallback);