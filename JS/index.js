$(document).ready(() => {
    console.log("JQuery Loaded")
    AnimateScrollAtBottom()
 
})

$("#signout").click(()  => {
    //if(firebase current user){DisableUI()}else{EnableUI()}
   
})


$('#message-input-form').submit((e) => {
    e.preventDefault()
    //take message input
    const messageInput = $("#message-input").val()

    //check if message was given to us
    if (messageInput && messageInput.length > 0) {
        const senderName = "Ankit joshi"
        const avtarLink = "Assets/avtar.png"
        //make message bubble
        AddMyMessage(avtarLink , senderName , messageInput)
        $("#message-input").val('')
        AnimateScrollAtBottom()
      
    }
})

const AddMyMessage = (avtarLink , senderName , messageInput) => {
    const messageBubble = `<div class="message-container">
    <img src="${avtarLink}" alt="Avtar" class="avtar right">
    <div class="message my-message right">
        <span class="sendername">
            ${senderName}
        </span>
        <p>
            ${messageInput}
        </p>
    </div>
    </div>`

//add message in ui
$(".chat-container-messages").append(messageBubble)
}

const AddSenderMessage = (avtarLink , senderName , messageInput) => {
    const messageBubble = `<div class="message-container">
    <img src="${avtarLink}" alt="Avtar" class="avtar left">
    <div class="message other-message left">
        <span class="sendername">
            ${senderName}
        </span>
        <p>
            ${messageInput}
        </p>
    </div>
    </div>`

//add message in ui
$(".chat-container-messages").append(messageBubble)
}

const AnimateScrollAtBottom = () => {
    $(".chat-container-messages").animate({
        scrollTop:   $(".chat-container-messages")[0].scrollHeight
    } , 1000)
}

const DisableUI = () => {
    //disable send button
    $(".button-send").prop("disabled" , true);
    //remove all messages
    ClearMessages();

    $('.button-signout').html('Sign in')
}

const ClearMessages = () => {
    $('.message-container').remove()
}

const EnableUI = () => {
    //disable send button
    $(".button-send").prop("disabled" , false);
    $('.button-signout').html('Sign out')
}



