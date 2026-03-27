package com.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.repository.RoomsRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional

public class RoomsService {

    private final RoomsRepository roomsRepository;
    
    public RoomsService(RoomsRepository roomsRepository) {
        this.roomsRepository = roomsRepository;
    }

    public List<Object[]> findAvailableRooms(){
        return roomsRepository.findAvailableRooms();
    }
    public int updateRoomLogin(Integer roomId) {
        int currentOccupants = roomsRepository.findCurrentOccupantsByRoomId(roomId);
        currentOccupants += 1;
        int updateCount = roomsRepository.updateOccupants(currentOccupants, roomId);
        int capacity = roomsRepository.findCapacityByRoomId(roomId);
        if (capacity !=0 && currentOccupants == capacity) {
            roomsRepository.updateRoomStatus("occupied", roomId);
        }
        return updateCount;
    }


    int updateRoomStatus(String status, Integer roomId) {
        return roomsRepository.updateRoomStatus(status, roomId);
    }

    int updateOccupants(Integer currentOccupants, Integer roomId) {
        return roomsRepository.updateOccupants(currentOccupants, roomId);
    }


}
