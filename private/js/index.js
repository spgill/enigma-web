// Establish module
app = angular.module('spgill.EnigmaWeb', ['ngMaterial'])


// Configure the theme(s)
app.config(function($mdThemingProvider) {

    // Normal enigma theme
    $mdThemingProvider.theme('normal')
        .primaryPalette('teal')
        .accentPalette('lime')
        .warnPalette('red')

    // Byte enigma theme
    $mdThemingProvider.theme('byte')
        .primaryPalette('deep-purple')
        .accentPalette('lime')
        .warnPalette('red')

    // Keep an eye on the streets
    $mdThemingProvider.alwaysWatchTheme(true)

})


// Define main controller (this app is so small, I'll only need one).
app.controller('MainController', function($http) {
    // Mode flag. false - enigma, true - bitnigma
    this.bitmode = false
    this.testing = '1 2 3'

    // Enumerate the rotors and reflectors
    this.classic_rotor_list = [
        ["Commercial Enigma - Rotor I", "com1"],
        ["Commercial Enigma - Rotor II", "com2"],
        ["Commercial Enigma - Rotor III", "com3"],
        ["Enigma I - Rotor I", "enig1"],
        ["Enigma I - Rotor II", "enig2"],
        ["Enigma I - Rotor III", "enig3"],
        ["M3 & M4 Naval Enigma - Rotor VI", "navy6"],
        ["M3 & M4 Naval Enigma - Rotor VII", "navy7"],
        ["M3 & M4 Naval Enigma - Rotor VIII", "navy8"],
        ["M3 Army - Rotor IV", "army4"],
        ["M3 Army - Rotor V", "army5"],
        ["Railway Enigma - Rotor I", "rail1"],
        ["Railway Enigma - Rotor II", "rail2"],
        ["Railway Enigma - Rotor III", "rail3"],
        ["Swiss K Enigma - Rotor I", "swiss1"],
        ["Swiss K Enigma - Rotor II", "swiss2"],
        ["Swiss K Enigma - Rotor III", "swiss3"]
    ]
    this.classic_reflector_list = [
        ["Railway Enigma - Reflector", "rail-ref"],
        ["Reflector - A", "ref-a"],
        ["Reflector - A Thin", "ref-at"],
        ["Reflector - B", "ref-b"],
        ["Reflector - B Thin", "ref-bt"],
        ["Reflector - Beta", "ref-beta"],
        ["Reflector - C", "ref-c"],
        ["Reflector - Gamma", "ref-gamma"],
        ["Swiss K Enigma - Reflector", "swiss-ref"]
    ]

    // Classic mode form vars
    this.classic_busy = false
    this.classic_rotors = [null, null, null]
    this.classic_reflector = null
    this.classic_text = ''

    // Classic mode methods
    this.classic_ready = () => {
        for (rotor of this.classic_rotors) {
            if (rotor == null) { return false; }
        }
        return this.classic_reflector != null && this.classic_text != ''
    }

    this.classic_go = () => {
        this.classic_busy = true
        let request = $http.post('/api/enigma', {
            'rotors': this.classic_rotors,
            'reflector': this.classic_reflector,
            'text': this.classic_text
        })

        request.then(
            // Success
            (response) => {
                this.classic_busy = false
                this.classic_text = response.data
            },

            // Error
            (response) => {
                this.classic_busy = false
                alert('Unknown error encountered. Try reloading the page.')
            }
        )
    }

})
