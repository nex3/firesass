FBL.ns(function() { with (FBL) {
    // A map of editor protocols to their string names.
    // Each of these should work with the format "protocol://open?url=%s&line=%s".
    // They should also each have localized strings.
    const editorProtocols = {
        txmt: "Textmate",
        mvim: "MacVim",
        emacs: "Emacs"
    };

    var stringBundle = document.getElementById("firesass-strings");

    var eps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
        .getService(Components.interfaces.nsIExternalProtocolService);
    var sl = Firebug.getRep(new FBL.SourceLink());

    function cacheSassDebugInfo(sourceLink) {
        if (sourceLink.type != "css" || sourceLink.sassDebugInfo) {
            sourceLink.sassDebugInfo = {};
            return;
        }

        var rules = sourceLink.object.parentStyleSheet.cssRules;
        for(var i=0; i<rules.length-1; i++)
        {
            
            var styleRule = rules[i+1];
            var mediaRule = rules[i];
            if (mediaRule.type != CSSRule.MEDIA_RULE) continue;
            if (styleRule.type != CSSRule.STYLE_RULE){
                if (mediaRule.cssRules[0].type === CSSRule.MEDIA_RULE){
                    for(var i2=0; i2<mediaRule.cssRules.length-1; i2++)
                    {
                        var styleRule2 = mediaRule.cssRules[i2+1];
                        var mediaRule2 = mediaRule.cssRules[i2];
                        if (mediaRule2.type != CSSRule.MEDIA_RULE) continue;
                        if (styleRule2.type != CSSRule.STYLE_RULE)continue;
                        
                        styleRule2.sassDebugInfo = {};
                        
                        if (mediaRule2.media.mediaText != "-sass-debug-info") continue;

                        for (var j2=0; j2<mediaRule2.cssRules.length; j2++)
                        {
                            styleRule2.sassDebugInfo[mediaRule2.cssRules[j2].selectorText] =
                                mediaRule2.cssRules[j2].style.getPropertyValue("font-family");
                        }
                        
                    }
                }else{
                    continue;
                }
            }
            styleRule.sassDebugInfo = {};
            
            if (mediaRule.media.mediaText != "-sass-debug-info") continue;

            for (var j=0; j<mediaRule.cssRules.length; j++)
            {
                styleRule.sassDebugInfo[mediaRule.cssRules[j].selectorText] =
                    mediaRule.cssRules[j].style.getPropertyValue("font-family");
            }
            
        }

            // We only care about media rules.
            if (mediaRule.type === CSSRule.MEDIA_RULE) {

                // If this is a 'regular' mediaquery, dive in and parse its internal rules.
                if (mediaRule.media.mediaText !== "-sass-debug-info") {
                    parseCssRules(mediaRule.cssRules);
                    continue;
                };

                // If this is a firesass mediaquery and the next rule is a style rule, get the debug info.
                if ( mediaRule.media.mediaText === "-sass-debug-info" && styleRule.type === CSSRule.STYLE_RULE ) {

                    styleRule.sassDebugInfo = {};

                    for (var j=0; j<mediaRule.cssRules.length; j++)
                    {
                        styleRule.sassDebugInfo[mediaRule.cssRules[j].selectorText] =
                            mediaRule.cssRules[j].style.getPropertyValue("font-family");
                    }
                }
            };
        }
    }

    sl.getSourceLinkTitle = function(sourceLink)
    {
        if (!sourceLink)
            return "";

        cacheSassDebugInfo(sourceLink);

        try
        {
            var fileName = getFileName(sourceLink.sassDebugInfo["filename"] || sourceLink.href);
            fileName = decodeURIComponent(fileName);
            fileName = cropString(fileName, 17);
        }
        catch(exc)
        {
        }

        return $STRF("Line", [fileName, sourceLink.sassDebugInfo["line"] || sourceLink.line]);
    };

    sl.copyLink = function(sourceLink)
    {
        var sassFilename = sourceLink.sassDebugInfo["filename"];
        if (sassFilename)
        {
            var url = splitURLTrue(sassFilename);
            copyToClipboard(url.path + "/" + url.name);
        }
        else
            copyToClipboard(sourceLink.href);
    };

    sl.getTooltip = function(sourceLink)
    {
        return decodeURI(sourceLink.sassDebugInfo["filename"] || sourceLink.href);
    };

    var oldGetContextMenuItems = sl.getContextMenuItems;
    sl.getContextMenuItems = function(sourceLink, target, context) {
        var items = oldGetContextMenuItems(sourceLink, target, context);

        if (!sourceLink.sassDebugInfo["filename"])
            return items;

        var hasDivider = false;
        for (var protocol in editorProtocols)
        {
            if (!eps.externalProtocolHandlerExists(protocol))
                continue;

            if (!hasDivider)
            {
                items.push("-");
                hasDivider = true;
            }

            items.push({
                label: stringBundle.getString("OpenIn" + editorProtocols[protocol]),
                command: bindFixed(this.openInEditor, this, protocol, sourceLink)
            });
        }

        return items;
    };

    sl.openInEditor = function(protocol, sourceLink) {
        var url = protocol + "://open?";
        url += "url=" + encodeURIComponent(sourceLink.sassDebugInfo["filename"]);

        if (sourceLink.sassDebugInfo["line"])
            url += "&line=" + sourceLink.sassDebugInfo["line"];

        window.location = url;
    };
}});
