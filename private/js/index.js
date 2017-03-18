// Establish module
let app = angular.module('spgill.EnigmaWeb', ['ngCookies', 'ngMaterial', 'angularFileUpload'])


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
    this.bytemode = true
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
    this.classic_busy = false
    this.classic_plugs = []
    this.classic_plugs_selected = []
    this.classic_rotors = [null, null, null]
    this.classic_settings = ['A', 'A', 'A']
    this.classic_reflector = null
    this.classic_pentagraph = false
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
            'pentagraph': this.classic_pentagraph,
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





    /* Stuff for byte mode */
    this.byte_rotor_list = [
        ["Byte - Rotor I", "b1"],
        ["Byte - Rotor II", "b2"],
        ["Byte - Rotor III", "b3"],
        ["Byte - Rotor IV", "b4"],
        ["Byte - Rotor V", "b5"]
    ]
    this.byte_reflector_list = [
        ["Byte - Reflector A", "ba"],
        ["Byte - Reflector B", "bb"],
        ["Byte - Reflector C", "bc"]
    ]
    this.byte_abet = ["0x00", "0x01", "0x02", "0x03", "0x04", "0x05", "0x06", "0x07", "0x08", "0x09", "0x0a", "0x0b", "0x0c", "0x0d", "0x0e", "0x0f", "0x10", "0x11", "0x12", "0x13", "0x14", "0x15", "0x16", "0x17", "0x18", "0x19", "0x1a", "0x1b", "0x1c", "0x1d", "0x1e", "0x1f", "0x20", "0x21", "0x22", "0x23", "0x24", "0x25", "0x26", "0x27", "0x28", "0x29", "0x2a", "0x2b", "0x2c", "0x2d", "0x2e", "0x2f", "0x30", "0x31", "0x32", "0x33", "0x34", "0x35", "0x36", "0x37", "0x38", "0x39", "0x3a", "0x3b", "0x3c", "0x3d", "0x3e", "0x3f", "0x40", "0x41", "0x42", "0x43", "0x44", "0x45", "0x46", "0x47", "0x48", "0x49", "0x4a", "0x4b", "0x4c", "0x4d", "0x4e", "0x4f", "0x50", "0x51", "0x52", "0x53", "0x54", "0x55", "0x56", "0x57", "0x58", "0x59", "0x5a", "0x5b", "0x5c", "0x5d", "0x5e", "0x5f", "0x60", "0x61", "0x62", "0x63", "0x64", "0x65", "0x66", "0x67", "0x68", "0x69", "0x6a", "0x6b", "0x6c", "0x6d", "0x6e", "0x6f", "0x70", "0x71", "0x72", "0x73", "0x74", "0x75", "0x76", "0x77", "0x78", "0x79", "0x7a", "0x7b", "0x7c", "0x7d", "0x7e", "0x7f", "0x80", "0x81", "0x82", "0x83", "0x84", "0x85", "0x86", "0x87", "0x88", "0x89", "0x8a", "0x8b", "0x8c", "0x8d", "0x8e", "0x8f", "0x90", "0x91", "0x92", "0x93", "0x94", "0x95", "0x96", "0x97", "0x98", "0x99", "0x9a", "0x9b", "0x9c", "0x9d", "0x9e", "0x9f", "0xa0", "0xa1", "0xa2", "0xa3", "0xa4", "0xa5", "0xa6", "0xa7", "0xa8", "0xa9", "0xaa", "0xab", "0xac", "0xad", "0xae", "0xaf", "0xb0", "0xb1", "0xb2", "0xb3", "0xb4", "0xb5", "0xb6", "0xb7", "0xb8", "0xb9", "0xba", "0xbb", "0xbc", "0xbd", "0xbe", "0xbf", "0xc0", "0xc1", "0xc2", "0xc3", "0xc4", "0xc5", "0xc6", "0xc7", "0xc8", "0xc9", "0xca", "0xcb", "0xcc", "0xcd", "0xce", "0xcf", "0xd0", "0xd1", "0xd2", "0xd3", "0xd4", "0xd5", "0xd6", "0xd7", "0xd8", "0xd9", "0xda", "0xdb", "0xdc", "0xdd", "0xde", "0xdf", "0xe0", "0xe1", "0xe2", "0xe3", "0xe4", "0xe5", "0xe6", "0xe7", "0xe8", "0xe9", "0xea", "0xeb", "0xec", "0xed", "0xee", "0xef", "0xf0", "0xf1", "0xf2", "0xf3", "0xf4", "0xf5", "0xf6", "0xf7", "0xf8", "0xf9", "0xfa", "0xfb", "0xfc", "0xfd", "0xfe", "0xff"]

    // Byte mode form vars
    this.byte_busy = false
    this.byte_plugs = []
    this.byte_plugs_selected = []
    this.byte_rotors = [null, null, null]
    this.byte_settings = ['0x00', '0x00', '0x00']
    this.byte_reflector = null

    // Byte mode methods
    this.byte_ready = () => {
        for (let rotor of this.byte_rotors) {
            if (rotor == null) { return false; }
        }
        return this.byte_reflector != null && this.byte_text != ''
    }

    this.byte_plug_click = (letter) => {
        if (this.byte_plugs_selected.length == 1) {
            if (letter == this.byte_plugs_selected[0]) {
                this.byte_plugs_selected.pop()
                return
            }
        }

        this.byte_plugs_selected.push(letter)

        if (this.byte_plugs_selected.length == 2) {
            this.byte_plugs.push(this.byte_plugs_selected.join(' - '))
            this.byte_plugs_selected = []
        }
    }

    this.byte_plug_disabled = (letter) => {
        for (let pair of this.byte_plugs) {
            if (pair.indexOf(letter) >= 0) {
                return true
            }
        }
        return false
    }

    this.byte_go = () => {
        this.classic_busy = true
        let request = $http.post('/api/enigma', {
            'plugboard': this.classic_plugs,
            'rotors': [0, 1, 2].map((i) => `${this.classic_rotors[i]}:${this.classic_settings[i]}`),
            'reflector': this.classic_reflector,
            'pentagraph': this.classic_pentagraph,
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

    this.byte_state_save = () => {
        $cookies.putObject('byte_state', [
            this.byte_plugs,
            this.byte_rotors,
            this.byte_settings,
            this.byte_reflector
        ])
    }

    this.byte_state_available = () => {
        return $cookies.get('byte_state')
    }

    this.byte_state_load = () => {
        let state = $cookies.getObject('byte_state')
        this.byte_plugs = state[0]
        this.byte_rotors = state[1]
        this.byte_settings = state[2]
        this.byte_reflector = state[3]
    }

    this.byte_state_reset = () => {
        this.byte_plugs = []
        this.byte_rotors = [null, null, null]
        this.byte_settings = ['0x00', '0x00', '0x00']
        this.byte_reflector = null
    }

})
