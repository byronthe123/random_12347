console.log(`v. 8:50 AM`);  
  
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCk7T3d2TR7YhHywrqwmUOeG83x3sm70zM",
    authDomain: "train-scheduler2-9b38e.firebaseapp.com",
    databaseURL: "https://train-scheduler2-9b38e.firebaseio.com",
    projectId: "train-scheduler2-9b38e",
    storageBucket: "train-scheduler2-9b38e.appspot.com",
    messagingSenderId: "676542362753"
};
firebase.initializeApp(config);
const db = firebase.database();

//Hide content container prior to user authentication:

//Login/User Authentication: --------------------------------------------------------------------------------------------------

      // FirebaseUI config.
    var uiConfig = {
        signInSuccessUrl: `https://byronthe123.github.io/random_12347/main.html`,
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ],
        'callbacks': {
            'signInSuccess': function(currentUser, credential, redirectUrl) {
                window.location.assign('https://byronthe123.github.io/random_12347/main.html');
                return true;
            }
        }
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        // tosUrl: '<your-tos-url>',
        // // Privacy policy url/callback.
        // privacyPolicyUrl: function() {
        //   window.location.assign('<your-privacy-policy-url>');
        // }
    };

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);

      firebase.auth().onAuthStateChanged(user => {
        if(!user) {
            alert('Please login');
            // window.location = 'https://byronthe123.github.io/random_12347/index.html'; //If User is not logged in, redirect to login page
        } 
      });

    //   if(window.location.href === 'https://byronthe123.github.io/random_12347/main.html') {
    //     firebase.auth().onAuthStateChanged(user => {
    //         if(!user) {
    //             alert('Please login');
    //             // window.location = 'https://byronthe123.github.io/random_12347/index.html'; //If User is not logged in, redirect to login page
    //         } 
    //       });
    //   }
//-----------------------------------------------------------------------------------------------

//Fucntions:
const readFromDB = () => {
    $('#table_body').empty();
    db.ref().on('child_added', (snapshot) => {
        // console.log(snapshot.val().db_train);
        // console.log(snapshot.val().db_train.name);   
        let sv = snapshot.val();
        let train = objFromDBSnapshotVal(sv);
        appendTrainHTML(train);
        console.log('working');
    })
}

const appendTrainHTML = (train) => {
    let tr = $(`
        <tr> 
            <th scope="row">${train.name}</th>
            <td>${train.destination}</td>
            <td>${train.frequency}</td>
            <td><span class='transition'>${train.nextArrival}</span></td>
            <td><span class='transition'>${train.minTillNexTrain}</span></td>
            <td class="far fa-trash-alt" id='${train.id}'></td>
        </tr> 
    `);

    $('#table_body').append(tr);
}

const objFromDBSnapshotVal = (snapshotVal) => {
    let train = new Train(snapshotVal.db_train.name, snapshotVal.db_train.destination, snapshotVal.db_train.firstTrainTime, snapshotVal.db_train.frequency);
    return train;
}

const deleteFromDB = (id) => {
    //https://stackoverflow.com/questions/40441625/firebase-remove-node-based-on-child-value
    db.ref().on('child_added', (snapshot) => {
        console.log(db.ref('-LQWWTynWCUv_DIjKTaB/db_train'));
        console.log(snapshot);
        console.log(snapshot.ref.path.pieces_[0]);
        console.log(snapshot.val());
        // console.log(snapshot.val().db_train.name);   
        let sv = snapshot.val();
        // let train = objFromDBSnapshotVal(sv);
        console.log(sv.db_train.id);
        if(sv.db_train.id === id) {
            console.log(`ID: ${sv.db_train.id} detected`);
            // let remove = db.ref(snapshot.Ce.path.n[0]);
            let remove = db.ref(snapshot.ref.path.pieces_[0]);
            remove.remove().then(function(){
                console.log('remove successful');
            }).catch(function(error){
                console.log('Custom error');
            })
        }
    })
}

deleteFromDB();

//Validate Train Time:
const validateFirstTrainTime = (firstTrainTime) => {
    if(firstTrainTime.includes(':')) {
        
        let textArr = firstTrainTime.split(':');
        
        for(let i = 0; i < textArr.length; i++) {
            if(textArr[i].length === 2) {
                for(let j = 0; j < textArr[i].length; j++) {
                    console.log(textArr[i][j]);
                    if(typeof(parseInt(textArr[i][j])) !== 'number'){
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}

let interval;

const runTimer = () => {
    clearInterval(interval);
    interval = setInterval(readFromDB, 10000);
}

const timer = () => {
    readFromDB();
}

//START PROGRAM:
readFromDB();
runTimer();

//DOM EVENTS:

//Submit button click:
$('#btn_submit').on('click', function(e){
    e.preventDefault();

    let name = $('#in_name').val().trim();
    let destination = $('#in_destination').val().trim();
    let firstTrainTime = $('#in_first_train_time').val().trim();
    let frequency = $('#in_frequency').val();

    if(validateFirstTrainTime(firstTrainTime)) {
        //Run rest of program:
        let train = new Train(name, destination, firstTrainTime, frequency);

        db.ref().push({
            db_train: train
        });

        readFromDB();

    } else {
        alert(`Invalid time format - please enter all input in the following format: HH:mm.\ Example: 01:23 or 22:45`);
    }

}); 

$(document).on('click', '.fa-trash-alt', function() {
    let id = ($(this).parent().prevObject[0].id);
    // console.log(p);
    deleteFromDB(id);
    // $(this).parent().remove();
    readFromDB();
});
