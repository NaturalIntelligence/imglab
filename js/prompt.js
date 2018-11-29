$(function(){
    $.confirm({
        title: '',
        content: '<img src="img/imglab_logo.png"><br>'
        + '<p>Imglab is an open source free to use application.</p>'
        + '<p> Please consider small donation for support.</p>'
        + '<p> Give us a <a href="https://github.com/NaturalIntelligence/imglab/stargazers">star</a> on GitHub or <a href="https://github.com/NaturalIntelligence/imglab/blob/master/showcase.md" >showcase</a> your project as a motivation.</p>',
        escapeKey: true,
        backgroundDismiss: true,
        buttons: {
            confirm: {
                text: "Donate",
                action : function () {
                    displayDonationPrompt();
                }
            },
            leave : {
                text: "Umm! may be next time."
            }
        }
    });
});

function displayDonationPrompt(){
    $.dialog({
        title: 'Donate',
        content: `<div style="text-align:center;">
                <div>
                    <div onclick="javascript:tezpayment()" class="chip" style="cursor: pointer;">
                        <img src="img/tez_logo2.png" alt="Tez" width="95" height="95"> Tez
                    </div>
                </div>
                <br>
                <div><a onclick="javascript:logPaypal()" href="https://www.paypal.me/amitkumarguptagwl" target="_blank"><img src="img/support_paypal.svg" width="200px"></a></div>
                <br>
                <div><a onclick=""javascript:logPateron()" href="https://www.patreon.com/bePatron?u=9531404"  target="_blank"><img src="img/support_patreon.svg" width="200px"></a></div>
            <div>`,
        escapeKey: true,
        backgroundDismiss: true,
    });
}

function tezpayment(){
    $.dialog({
        title: "Tez Payment",
        content: "<p>Please scan the below QR code or use UPI : amitgupta.gwl@okhdfcbank</p>" + '<img src="img/tez_qrcode.png">'
    })
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "tez",
        'transport_type': 'beacon',
    });
}

function logPaypal(){
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "paypal",
        'transport_type': 'beacon',
    });
}

function logPateron(){
    gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': "patreon",
        'transport_type': 'beacon',
    });
}


