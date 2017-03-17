// Establish module
let app = angular.module('spgill.EnigmaWeb', ['ngCookies', 'ngMaterial'])


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
app.controller('MainController', function($http, $cookies) {
    // Mode flag. false - enigma, true - bitnigma
    this.bitmode = false
    this.testing = '1 2 3'

    // Enumerate the rotors and reflectors
    this.classic_rotor_list = [
        ["Enigma D - Rotor I", "d1"],
        ["Enigma D - Rotor II", "d2"],
        ["Enigma D - Rotor III", "d3"],
        ["Enigma G - Rotor I", "g1"],
        ["Enigma G - Rotor II", "g2"],
        ["Enigma G - Rotor III", "g3"],
        ["Enigma G111 - Rotor I", "g1111"],
        ["Enigma G111 - Rotor II", "g1112"],
        ["Enigma G111 - Rotor V", "g1115"],
        ["Enigma G260 - Rotor I", "g2601"],
        ["Enigma G260 - Rotor II", "g2602"],
        ["Enigma G260 - Rotor III", "g2603"],
        ["Enigma G312 - Rotor I", "g3121"],
        ["Enigma G312 - Rotor II", "g3122"],
        ["Enigma G312 - Rotor III", "g3123"],
        ["Enigma I - Rotor I", "11"],
        ["Enigma I - Rotor II", "12"],
        ["Enigma I - Rotor III", "13"],
        ["Enigma I - Rotor IV", "14"],
        ["Enigma I - Rotor V", "15"],
        ["Enigma K - Rotor I", "k1"],
        ["Enigma K - Rotor II", "k2"],
        ["Enigma K - Rotor III", "k3"],
        ["Enigma KD - Rotor I", "kd1"],
        ["Enigma KD - Rotor II", "kd2"],
        ["Enigma KD - Rotor III", "kd3"],
        ["Enigma M3 - Rotor I", "m31"],
        ["Enigma M3 - Rotor II", "m32"],
        ["Enigma M3 - Rotor III", "m33"],
        ["Enigma M3 - Rotor IV", "m34"],
        ["Enigma M3 - Rotor V", "m35"],
        ["Enigma M3 - Rotor VI", "m36"],
        ["Enigma M3 - Rotor VII", "m37"],
        ["Enigma M3 - Rotor VIII", "m38"],
        ["Enigma M4 - Rotor Beta (\u03b2)", "m4beta"],
        ["Enigma M4 - Rotor Gamma (\u03b3)", "m4gamma"],
        ["Enigma M4 - Rotor I", "m41"],
        ["Enigma M4 - Rotor II", "m42"],
        ["Enigma M4 - Rotor III", "m43"],
        ["Enigma M4 - Rotor IV", "m44"],
        ["Enigma M4 - Rotor V", "m45"],
        ["Enigma M4 - Rotor VI", "m46"],
        ["Enigma M4 - Rotor VII", "m47"],
        ["Enigma M4 - Rotor VIII", "m48"],
        ["Enigma T - Rotor I", "t1"],
        ["Enigma T - Rotor II", "t2"],
        ["Enigma T - Rotor III", "t3"],
        ["Enigma T - Rotor IV", "t4"],
        ["Enigma T - Rotor V", "t5"],
        ["Enigma T - Rotor VI", "t6"],
        ["Enigma T - Rotor VII", "t7"],
        ["Enigma T - Rotor VIII", "t8"],
        ["Norway Enigma - Rotor I", "norway1"],
        ["Norway Enigma - Rotor II", "norway2"],
        ["Norway Enigma - Rotor III", "norway3"],
        ["Norway Enigma - Rotor IV", "norway4"],
        ["Norway Enigma - Rotor V", "norway5"],
        ["Railway Enigma - Rotor I", "rail1"],
        ["Railway Enigma - Rotor II", "rail2"],
        ["Railway Enigma - Rotor III", "rail3"],
        ["Swiss Enigma K - Rotor I", "swissk1"],
        ["Swiss Enigma K - Rotor II", "swissk2"],
        ["Swiss Enigma K - Rotor III", "swissk3"]
    ]
    this.classic_reflector_list = [
        ["Enigma D - Reflector", "d"],
        ["Enigma G - Reflector", "g"],
        ["Enigma G111 - Reflector", "g111"],
        ["Enigma G260 - Reflector", "g260"],
        ["Enigma G312 - Reflector", "g312"],
        ["Enigma I - Reflector A", "1a"],
        ["Enigma I - Reflector B", "1b"],
        ["Enigma I - Reflector C", "1c"],
        ["Enigma K - Reflector", "k"],
        ["Enigma KD - Reflector", "kd"],
        ["Enigma M3 - Reflector B", "m3b"],
        ["Enigma M3 - Reflector C", "m3c"],
        ["Enigma M4 - Reflector B Thin", "m4bthin"],
        ["Enigma M4 - Reflector C Thin", "m4cthin"],
        ["Enigma T - Reflector", "t"],
        ["Norway Enigma - Reflector", "norway"],
        ["Railway Enigma - Reflector", "rail"],
        ["Swiss Enigma K - Reflector", "swissk"]
    ]
    this.classic_abet = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ]

    // Classic mode form vars
    this.classic_expanded = true
    this.classic_busy = false
    this.classic_plugs = []
    this.classic_plugs_selected = []
    this.classic_rotors = [null, null, null]
    this.classic_settings = ['A', 'A', 'A']
    this.classic_reflector = null
    this.classic_text = ''

    // Classic mode methods
    this.classic_ready = () => {
        for (let rotor of this.classic_rotors) {
            if (rotor == null) { return false; }
        }
        return this.classic_reflector != null && this.classic_text != ''
    }

    this.classic_plug_click = (letter) => {
        if (this.classic_plugs_selected.length == 1) {
            if (letter == this.classic_plugs_selected[0]) {
                this.classic_plugs_selected.pop()
                return
            }
        }

        this.classic_plugs_selected.push(letter)

        if (this.classic_plugs_selected.length == 2) {
            this.classic_plugs.push(this.classic_plugs_selected.join(''))
            this.classic_plugs_selected = []
        }
    }

    this.classic_plug_disabled = (letter) => {
        for (let pair of this.classic_plugs) {
            if (pair.indexOf(letter) >= 0) {
                return true
            }
        }
        return false
    }

    this.classic_go = () => {
        this.classic_busy = true
        let request = $http.post('/api/enigma', {
            'plugboard': this.classic_plugs,
            'rotors': [0, 1, 2].map((i) => `${this.classic_rotors[i]}:${this.classic_settings[i]}`),
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

    this.classic_state_save = () => {
        $cookies.putObject('classic_state', [
            this.classic_plugs,
            this.classic_rotors,
            this.classic_settings,
            this.classic_reflector
        ])
    }

    this.classic_state_available = () => {
        return $cookies.get('classic_state')
    }

    this.classic_state_load = () => {
        let state = $cookies.getObject('classic_state')
        this.classic_plugs = state[0]
        this.classic_rotors = state[1]
        this.classic_settings = state[2]
        this.classic_reflector = state[3]
    }

    this.classic_state_reset = () => {
        this.classic_plugs = []
        this.classic_rotors = [null, null, null]
        this.classic_settings = ['A', 'A', 'A']
        this.classic_reflector = null
    }

})
