riot.tag2('actionbar', '', '', '', function(opts) {
});
riot.tag2('facepp', '', '', '', function(opts) {
});
riot.tag2('menu', '', '', '', function(opts) {
});
riot.tag2('statusbar', '', '', '', function(opts) {
});
riot.tag2('toolbox', '<div each="{tool in tools[opts.tools]}" id="{tool.id}" class="tool-button" onclick="{selectme}"> <img class="tool-icon" riot-src="img/icons/{tool.icon}"> <div>{tool.title}</div> </div>', 'toolbox .tool-button,[data-is="toolbox"] .tool-button{ text-align: center; margin: 14px 0px; } toolbox .tool-icon,[data-is="toolbox"] .tool-icon{ width: 40px; margin: 3px 0px; } toolbox .tool-selected,[data-is="toolbox"] .tool-selected{ background: coral; } toolbox .tool-button:not(.tool-selected):hover,[data-is="toolbox"] .tool-button:not(.tool-selected):hover{ background: grey; }', '', function(opts) {

        var tag = this;
        tag.selectme = selectme;

        function selectme(e){

            $(".tool-selected").removeClass("tool-selected");
            $(e.currentTarget).addClass("tool-selected");
            riot.trigger("tool-selected",e.item.tool);
        }
});

riot.tag2('workarea', '', '', '', function(opts) {
});