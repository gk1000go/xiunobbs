<?php

function thread_digest_delete($tid, $uid, $fid) {
	$r = db_delete('thread_digest', array('tid'=>$tid));
	if($r !== FALSE) {
		user_update($uid, array('digests-'=>1));
		forum_update($fid, array('digests-'=>1));
		runtime_set('digests-', 1);
	}
	return $r;
}

function thread_digest_create($tid, $digest, $uid, $fid) {
	$r = db_create('thread_digest', array('fid'=>$fid, 'tid'=>$tid, 'uid'=>$uid, 'digest'=>$digest));
	if($r !== FALSE) {
		user_update($uid, array('digests+'=>1));
		forum_update($fid, array('digests+'=>1));
		runtime_set('digests+', 1);
	}
	return $r;
}

function thread_digest_change($tid, $digest, $uid, $fid) {
	if($digest == 0) {
		thread_digest_delete($tid, $uid, $fid);
	} else {
		thread_digest_create($tid, $digest, $uid, $fid);
	}
	thread_update($tid, array('digest'=>$digest));
}


function thread_digest_find_by_fid($fid = 0, $page = 1, $pagesize = 20) {
	if($fid == 0) {
		$threadlist = db_find('thread_digest', array(), array('tid'=>-1), $page, $pagesize, 'tid');
	} else {
		$threadlist = db_find('thread_digest', array('fid'=>$fid), array('tid'=>-1), $page, $pagesize, 'tid');
	}
	$tids = arrlist_values($threadlist, 'tid');
	$threadlist = thread_find_by_tids($tids);
	return $threadlist;
}

function thread_digest_find_by_uid($uid, $page = 1, $pagesize = 20) {
	
	$threadlist = db_find('thread_digest', array('uid'=>$uid), array('tid'=>-1), $page, $pagesize, 'tid');
	
	$tids = arrlist_values($threadlist, 'tid');
	$threadlist = thread_find_by_tids($tids);
	return $threadlist;
}

function thread_digest_count($fid = 0) {
	global $forumlist;
	if($fid == 0) {
		return db_count('thread_digest');
	} else {
		return $forumlist[$fid]['digests'];
	}
}

?>