'use client'

import { useSocket } from "@/hooks/useSocket"

/**
 * Monte le useSocket pour gérer la connexion et reconnexion de manière globale depuis le plus haut niveau
 */

export function SocketManager() {
    useSocket()
    return null
}