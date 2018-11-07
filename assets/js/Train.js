class Train {
    constructor(name, destination, firstTrainTime, frequency){
        this.name = name;
        this.destination = destination;
        this.firstTrainTime = firstTrainTime;
        this.frequency = frequency;
        this.id = this.setId();
        // this.id = `${name.charAt(0)}${name.charAt(name.length-1)}-${destination.charAt(0)}${destination.charAt(destination.length -1)}`;
    }

    setId() {
        let str1 = '';
        let str2 = '';
        str1 += `${this.name.charAt(0)}${this.name.charAt(this.name.length-1)}`;
        str2 += `${this.destination.charAt(0)}${this.destination.charAt(this.destination.length -1)}`;
        let id = `${str1}-${str2}`
        return id;
    }

    get nextArrival(){
        return this.getNextArrivalandTime()[0];
    }

    get minTillNexTrain() {
        return this.getNextArrivalandTime()[1];
    }

    getNextArrivalandTime() {
        let firstTrainTimeConverted = moment(this.firstTrainTime, 'HH:mm').subtract(1, 'years');
        let diffTime = moment().diff(moment(firstTrainTimeConverted), 'minutes');
        let remainder = diffTime % this.frequency;
        let minTillNexTrain = this.frequency - remainder;
        let nextTrainTime = moment().add(minTillNexTrain, 'minutes');
        nextTrainTime = nextTrainTime.format('hh:mm a');
        return [nextTrainTime, minTillNexTrain];
    }
}