console.log(`v. 11/11/18 1:51 AM`);  
  
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

//Login/User Authentication: --------------------------------------------------------------------------------------------------

    let signingOut = false;

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
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    if(window.location.href === 'https://byronthe123.github.io/random_12347/index.html' || window.location.href === 'https://byronthe123.github.io/random_12347/') {
        ui.start('#firebaseui-auth-container', uiConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
            if(window.location.href === 'https://byronthe123.github.io/random_12347/main.html') {
                if(!signingOut) {
                    alert(`Please login to continue.`);
                }
                window.location.href = 'https://byronthe123.github.io/random_12347/index.html';
            }
        } else {
            $('#out_username').text(user.displayName);
            $('#out_user_email').text(user.email);
            $('#img_user_photo').attr('src', user.photoURL);
        }
    });

    //Logout/Signout:
    $(document).on('click', '#signout', function(){
        firebase.auth().signOut().then(function() {
            signingOut = true;
            alert('Signed out successfully');
            window.location.href = `https://byronthe123.github.io/random_12347/index.html`;
        }, function(error) {
            // An error happened.
        });
        signingOut = false;
    });

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
            <td class="fas fa-sync-alt" id='${train.id}'></td>
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

//Manually Update Train:
const manuallyUpdate = (id) => {
    //https://stackoverflow.com/questions/40441625/firebase-remove-node-based-on-child-value
    let updatedTrainToReturn = null;
    db.ref().on('child_added', (snapshot) => {
        let sv = snapshot.val();
        // let train = objFromDBSnapshotVal(sv);
        if(sv.db_train.id === id) {
            // console.log(`ID: ${sv.db_train.id} detected`);
            // let remove = db.ref(snapshot.Ce.path.n[0]);
            let updatedTrain = new Train(sv.db_train.name, sv.db_train.destination, sv.db_train.firstTrainTime, sv.db_train.frequency);
            let updatedTr = $(`
            <tr> 
                <th scope="row">${updatedTrain.name}</th>
                <td>${updatedTrain.destination}</td>
                <td>${updatedTrain.frequency}</td>
                <td><span class='transition'>${updatedTrain.nextArrival}</span></td>
                <td><span class='transition'>${updatedTrain.minTillNexTrain}</span></td>
                <td class="fas fa-sync-alt" id='${updatedTrain.id}'></td>
                <td class="far fa-trash-alt" id='${updatedTrain.id}'></td>
            </tr> 
        `);
        updatedTrainToReturn = updatedTr;
        }
    })
    return updatedTrainToReturn;
}


//Validate Train Time:
const validateFirstTrainTime = (firstTrainTime, frequency) => {
    if(firstTrainTime.includes(':')) {
        
        let textArr = firstTrainTime.split(':');
        
        for(let i = 0; i < textArr.length; i++) {
            if(textArr[i].length === 2) {
                for(let j = 0; j < textArr[i].length; j++) {
                    console.log(textArr[i][j]);
                    if(typeof(parseInt(textArr[i][j])) !== 'number'){
                        return false;
                    } else {
                        let testTrain = new Train('', '', firstTrainTime, frequency);
                        console.log(testTrain.minTillNexTrain);
                        console.log(typeof(testTrain.minTillNexTrain));
                        if(testTrain.minTillNexTrain >= 0) {
                            return true;
                        }
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
    interval = setInterval(readFromDB, 30000);
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

    if(frequency >= 1) {
        if(validateFirstTrainTime(firstTrainTime, frequency)){
            //Run rest of program:
            let train = new Train(name, destination, firstTrainTime, frequency);
    
            db.ref().push({
                db_train: train
            });
    
            readFromDB();
    
        } else {
            alert(`Invalid time format - please enter all input in the following format: HH:mm.\nExample: 01:23 or 22:45\nTime values cannot exceed 24:00.`);
        }
    } else {
        alert('Invalid frequency.');
    }

}); 

$(document).on('click', '.fa-trash-alt', function() {
    let id = ($(this).parent().prevObject[0].id);
    // console.log(p);
    deleteFromDB(id);
    // $(this).parent().remove();
    readFromDB();
});

//Click Update Button:
$(document).on('click', '.fa-sync-alt', function() {
    alert('update clicked');
    console.log($(this).parent());
    console.log($(this).parent().prevObject[0]);
    let id = ($(this).parent().prevObject[0].id);
    let parent = $(id).parent();
    console.log(parent);
    console.log(manuallyUpdate(id));
    let parent2 = document.getElementById(id).parentNode;
    console.log('parent2 ' + parent2);
    // $(this).parent().prevObject[0].replaceWith(manuallyUpdate(id));
});
