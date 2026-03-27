package com.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.entity.Rooms;

@Repository
public interface RoomsRepository extends JpaRepository<Rooms, Integer> {

    // ===== INSERT (if needed as a native query, though save() from JpaRepository usually handles this) =====
    @Modifying
    @Query(value = """
        INSERT INTO Rooms (room_no, room_type, floor, current_occupants, monthly_rent, status)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)
        """, nativeQuery = true)
    int insertRoom(String roomNo, String roomType, Integer floor, Integer currentOccupants,
                   Double monthlyRent, String status);

    // ===== SELECT OPERATIONS =====
    @Query(value = "SELECT * FROM Rooms WHERE room_id = ?1", nativeQuery = true)
    Optional<Rooms> findByRoomId(Integer roomId);

    @Query(value = "SELECT * FROM Rooms WHERE room_no = ?1", nativeQuery = true)
    Optional<Rooms> findByRoomNo(String roomNo);

    @Query(value = "SELECT * FROM Rooms", nativeQuery = true)
    List<Rooms> findAllRooms();

    @Query(value = "SELECT capacity FROM Rooms WHERE room_Id=?1", nativeQuery = true)
    Integer findCapacityByRoomId(Integer roomId);


     @Query(value = "SELECT current_occupants FROM Rooms WHERE room_Id=?1", nativeQuery = true)
    Integer findCurrentOccupantsByRoomId(Integer roomId);

    @Query(value = "SELECT  room_id,room_No, room_type,floor, monthly_rent,current_occupants FROM Rooms WHERE status = 'available'", nativeQuery = true)
    List<Object []> findAvailableRooms();

    // ===== UPDATE OPERATIONS =====
    @Modifying
    @Query(value = "UPDATE Rooms SET current_occupants = ?1 WHERE room_id = ?2", nativeQuery = true)
    int updateOccupants(Integer currentOccupants, Integer roomId);

    @Modifying
    @Query(value = "UPDATE Rooms SET status = ?1 WHERE room_id = ?2", nativeQuery = true)
    int updateRoomStatus(String status, Integer roomId);

    // ===== DELETE OPERATIONS =====
    @Modifying
    @Query(value = "DELETE FROM Rooms WHERE room_id = ?1", nativeQuery = true)
    int deleteRoomById(Integer roomId);
}