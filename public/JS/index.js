const printData = (data) => {
    data.forEach((item) => {
        if(item.uid == firebase.auth().currentUser.uid){
            AddMyMessage(item.photoURL , item.displayName , item.message , false);
        }
        else {
            AddSenderMessage(item.photoURL , item.displayName , item.message);
        }
    })
    AnimateScrollAtBottom();

}


const fetchStaticData = () =>{
    ClearMessages();
    const ref = firebase.firestore().collection("chatMessages").orderBy("timeStamp" , "asc");
    let staticData = [];
    ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            staticData.push(doc.data());
        })
        console.log(staticData);
        printData(staticData);
    })
}

const authUser = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
  .signInWithPopup(provider).then(() => {
      fetchStaticData();
  })
}


$(document).ready(() => {
    console.log("JQuery Loaded")
    AnimateScrollAtBottom()
    authUser();
 
})

$("#signout").click(()  => {
    //if(firebase current user){DisableUI()}else{EnableUI()}
    if(!firebase.auth().currentUser){
        authUser();
        EnableUI();
    }
    else{
        //signout code
        firebase.auth().signOut();
        DisableUI();
        alert("You Have Signed Out !");
    }
   
})


$('#message-input-form').submit((e) => {
    e.preventDefault()
    //take message input
    const messageInput = $("#message-input").val()

    //check if message was given to us
    if (messageInput && messageInput.length > 0) {
        const senderName = firebase.auth().currentUser.displayName
        const avtarLink = firebase.auth().currentUser.photoURL
        //make message bubble
        AddMyMessage(avtarLink , senderName , messageInput , true )
        $("#message-input").val('')
        AnimateScrollAtBottom()
      
    }
})

const AddMyMessage = (avtarLink , senderName , messageInput , toggle) => {
    if(toggle){
        firebase.firestore().collection("chatMessages").doc().set({
            displayName : firebase.auth().currentUser.displayName ,
            photoURL : firebase.auth().currentUser.photoURL , 
            timeStamp : Date.now() , 
            message : messageInput , 
            uid : firebase.auth().currentUser.uid


        }).then(()=> {
            console.log("Document Successfully Written");
        })
    }

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


const ref = firebase.firestore().collection("chatMessages").orderBy("timeStamp" , "asc");
ref.onSnapshot((querySnapshot) => {
    var data = [];

    querySnapshot.docChanges().forEach((change) => {
        if(change.type === "added"){
            if(change.doc.data().uid !==  firebase.auth().currentUser.uid){
                data.push(change.doc.data());
                printData(data);

            }
        }
    })
})
